"""
Analytics tests — AnalyticsTracker, AnalyticsDashboard, API views.
"""
import pytest
from datetime import date, timedelta
from unittest.mock import patch
from django.test import RequestFactory
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from cms_pages.analytics import AnalyticsTracker, AnalyticsDashboard
from cms_pages.models import PageView, DailyStats
from .conftest import UserFactory, SiteFactory


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_mock_request(user_agent="Mozilla/5.0 (Windows NT 10.0) Chrome/100",
                       referrer="https://google.com",
                       ip="1.2.3.4"):
    factory = RequestFactory()
    request = factory.get("/")
    request.META["HTTP_USER_AGENT"] = user_agent
    request.META["HTTP_REFERER"] = referrer
    request.META["REMOTE_ADDR"] = ip
    return request


# ---------------------------------------------------------------------------
# AnalyticsTracker — device / browser / OS detection
# ---------------------------------------------------------------------------

@pytest.mark.analytics
class TestAnalyticsTrackerHelpers:

    def test_desktop_device_detection(self):
        ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100"
        assert AnalyticsTracker._get_device_type(ua) == "desktop"

    def test_mobile_device_detection(self):
        ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0) Mobile Safari/604.1"
        assert AnalyticsTracker._get_device_type(ua) == "mobile"

    def test_android_mobile_detection(self):
        ua = "Mozilla/5.0 (Linux; Android 11) Mobile Chrome/91"
        assert AnalyticsTracker._get_device_type(ua) == "mobile"

    def test_tablet_device_detection(self):
        ua = "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) tablet"
        assert AnalyticsTracker._get_device_type(ua) == "tablet"

    def test_chrome_browser_detection(self):
        ua = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100"
        assert AnalyticsTracker._get_browser(ua) == "Chrome"

    def test_firefox_browser_detection(self):
        ua = "Mozilla/5.0 (X11; Linux) Gecko/20100101 Firefox/98.0"
        assert AnalyticsTracker._get_browser(ua) == "Firefox"

    def test_safari_browser_detection(self):
        ua = "Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML) safari/604.1"
        assert AnalyticsTracker._get_browser(ua) == "Safari"

    def test_unknown_browser_returns_other(self):
        assert AnalyticsTracker._get_browser("curl/7.64.0") == "Other"

    def test_windows_os_detection(self):
        ua = "Mozilla/5.0 (Windows NT 10.0; Win64)"
        assert AnalyticsTracker._get_os(ua) == "Windows"

    def test_macos_detection(self):
        ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)"
        assert AnalyticsTracker._get_os(ua) == "macOS"

    def test_linux_os_detection(self):
        ua = "Mozilla/5.0 (X11; Linux x86_64)"
        assert AnalyticsTracker._get_os(ua) == "Linux"

    def test_android_os_detection(self):
        assert AnalyticsTracker._get_os("Android 11 Mobile") == "Android"

    def test_unknown_os_returns_other(self):
        assert AnalyticsTracker._get_os("unknown-bot/1.0") == "Other"

    def test_extract_domain_from_url(self):
        assert AnalyticsTracker._extract_domain("https://google.com/search?q=lsb") == "google.com"

    def test_extract_domain_empty_string(self):
        assert AnalyticsTracker._extract_domain("") == ""

    def test_extract_domain_none(self):
        assert AnalyticsTracker._extract_domain(None) == ""

    def test_country_from_ip_returns_empty(self):
        assert AnalyticsTracker._get_country_from_ip("1.2.3.4") == ""


# ---------------------------------------------------------------------------
# AnalyticsTracker — track_page_view
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.analytics
class TestAnalyticsTrackerTrackPageView:

    def test_track_page_view_creates_record(self, site):
        request = make_mock_request()
        view = AnalyticsTracker.track_page_view(site, request, "/home")
        assert view.pk is not None
        assert view.page_path == "/home"
        assert view.site == site

    def test_track_page_view_sets_device_type(self, site):
        request = make_mock_request(
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS) Mobile Safari"
        )
        view = AnalyticsTracker.track_page_view(site, request, "/")
        assert view.device_type == "mobile"

    def test_track_page_view_sets_referrer_domain(self, site):
        request = make_mock_request(referrer="https://facebook.com/some/path")
        view = AnalyticsTracker.track_page_view(site, request, "/")
        assert view.referrer_domain == "facebook.com"

    def test_track_page_view_sets_date_and_hour(self, site):
        request = make_mock_request()
        view = AnalyticsTracker.track_page_view(site, request, "/")
        now = timezone.now()
        assert view.date == now.date()
        assert 0 <= view.hour <= 23

    def test_track_page_view_updates_daily_stats(self, site):
        request = make_mock_request()
        AnalyticsTracker.track_page_view(site, request, "/")
        today = timezone.now().date()
        assert DailyStats.objects.filter(site=site, date=today).exists()

    def test_multiple_views_aggregate_correctly(self, site):
        request = make_mock_request()
        for _ in range(3):
            AnalyticsTracker.track_page_view(site, request, "/about")
        today = timezone.now().date()
        stats = DailyStats.objects.get(site=site, date=today)
        assert stats.total_views >= 3


# ---------------------------------------------------------------------------
# AnalyticsDashboard
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.analytics
class TestAnalyticsDashboard:

    def _seed_stats(self, site, days_back=0, total_views=10, unique=5):
        d = timezone.now().date() - timedelta(days=days_back)
        DailyStats.objects.update_or_create(
            site=site, date=d,
            defaults={"total_views": total_views, "unique_visitors": unique},
        )

    def test_get_overview_returns_expected_keys(self, site):
        data = AnalyticsDashboard.get_overview(site, days=30)
        for key in ["total_views", "total_visitors", "avg_daily_views",
                    "trend_percent", "trend_direction", "period_days"]:
            assert key in data

    def test_get_overview_sums_views(self, site):
        self._seed_stats(site, days_back=0, total_views=100)
        self._seed_stats(site, days_back=1, total_views=50)
        data = AnalyticsDashboard.get_overview(site, days=30)
        assert data["total_views"] >= 150

    def test_get_overview_trend_direction_up(self, site):
        # current period: 100 views, previous: 10 → trend up
        for i in range(30):
            self._seed_stats(site, days_back=i, total_views=100)
        for i in range(30, 60):
            self._seed_stats(site, days_back=i, total_views=10)
        data = AnalyticsDashboard.get_overview(site, days=30)
        assert data["trend_direction"] == "up"

    def test_get_chart_data_returns_list(self, site):
        self._seed_stats(site, days_back=0)
        data = AnalyticsDashboard.get_chart_data(site, days=30)
        assert isinstance(data, list)

    def test_get_chart_data_entry_shape(self, site):
        self._seed_stats(site, days_back=0, total_views=42, unique=7)
        data = AnalyticsDashboard.get_chart_data(site, days=30)
        assert len(data) >= 1
        entry = data[-1]
        assert "date" in entry
        assert "views" in entry
        assert "visitors" in entry
        assert entry["views"] == 42

    def test_get_top_pages(self, site):
        today = timezone.now().date()
        PageView.objects.create(
            site=site, page_path="/about", date=today, hour=10
        )
        PageView.objects.create(
            site=site, page_path="/about", date=today, hour=11
        )
        PageView.objects.create(
            site=site, page_path="/home", date=today, hour=12
        )
        data = list(AnalyticsDashboard.get_top_pages(site, days=30, limit=10))
        paths = [d["page_path"] for d in data]
        assert "/about" in paths
        about = next(d for d in data if d["page_path"] == "/about")
        assert about["views"] == 2

    def test_get_sources_separates_direct_and_referrers(self, site):
        today = timezone.now().date()
        PageView.objects.create(
            site=site, page_path="/", date=today,
            hour=10, referrer_domain="google.com"
        )
        PageView.objects.create(
            site=site, page_path="/", date=today,
            hour=11, referrer_domain=""
        )
        data = AnalyticsDashboard.get_sources(site, days=30)
        assert "referrers" in data
        assert "direct" in data
        assert data["direct"] >= 1
        referrer_domains = [r["referrer_domain"] for r in data["referrers"]]
        assert "google.com" in referrer_domains


# ---------------------------------------------------------------------------
# Analytics API Views
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.analytics
class TestAnalyticsAPIViews:

    def test_overview_requires_auth(self, api_client):
        url = reverse("analytics-overview")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_overview_returns_data_for_site_owner(self, api_client, db):
        owner = UserFactory.create_staff(username="analytics_owner")
        site = SiteFactory.create(owner=owner, subdomain="analytics-site")
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(owner)
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )
        url = reverse("analytics-overview")
        response = api_client.get(url + "?days=7")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "data" in response.data

    def test_overview_404_when_no_site(self, auth_client):
        url = reverse("analytics-overview")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_chart_requires_auth(self, api_client):
        url = reverse("analytics-chart")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_chart_returns_data(self, api_client, db):
        owner = UserFactory.create_staff(username="chart_owner")
        SiteFactory.create(owner=owner, subdomain="chart-site")
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(owner)
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )
        url = reverse("analytics-chart") + "?days=7"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data["data"], list)

    def test_pages_requires_auth(self, api_client):
        url = reverse("analytics-pages")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_sources_requires_auth(self, api_client):
        url = reverse("analytics-sources")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_realtime_requires_auth(self, api_client):
        url = reverse("analytics-realtime")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_realtime_returns_active_pages(self, api_client, db):
        owner = UserFactory.create_staff(username="rt_owner")
        site = SiteFactory.create(owner=owner, subdomain="rt-site")
        today = timezone.now().date()
        PageView.objects.create(
            site=site, page_path="/live", date=today, hour=timezone.now().hour
        )
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(owner)
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )
        url = reverse("analytics-realtime")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert "active_last_30min" in response.data["data"]
