"""
Lightweight Analytics for LSB Websites
Privacy-first, DSGVO-konform, keine Cookies nötig
"""
from datetime import datetime, timedelta
from django.db.models import Count, Q
from django.utils import timezone
from .models import Site, PageView, DailyStats


class AnalyticsTracker:
    """
    Hauptklasse für das Tracking von Page Views
    """
    
    @staticmethod
    def track_page_view(site, request, page_path='/'):
        """
        Track einen Page View - anonymisiert und DSGVO-konform
        """
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referrer = request.META.get('HTTP_REFERER', '')
        
        # User-Agent parsen (vereinfacht)
        device_type = AnalyticsTracker._get_device_type(user_agent)
        browser_family = AnalyticsTracker._get_browser(user_agent)
        os_family = AnalyticsTracker._get_os(user_agent)
        
        # Referrer domain extrahieren (ohne Query-Parameter)
        referrer_domain = AnalyticsTracker._extract_domain(referrer)
        
        # Land aus IP bestimmen (optional, vereinfachte Implementierung)
        country = AnalyticsTracker._get_country_from_ip(request.META.get('REMOTE_ADDR'))
        
        now = timezone.now()
        
        view = PageView.objects.create(
            site=site,
            page_path=page_path,
            country=country,
            device_type=device_type,
            browser_family=browser_family,
            os_family=os_family,
            referrer_domain=referrer_domain,
            hour=now.hour,
            date=now.date(),
        )
        
        # Tagesstatistik aktualisieren (asynchron wäre besser)
        AnalyticsTracker._update_daily_stats(site, now.date())
        
        return view
    
    @staticmethod
    def _get_device_type(user_agent):
        """Einfache Device-Erkennung"""
        ua = user_agent.lower()
        if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
            return 'mobile'
        elif 'tablet' in ua or 'ipad' in ua:
            return 'tablet'
        return 'desktop'
    
    @staticmethod
    def _get_browser(user_agent):
        """Browser-Erkennung"""
        ua = user_agent.lower()
        browsers = [
            ('chrome', 'Chrome'), ('firefox', 'Firefox'), ('safari', 'Safari'),
            ('edge', 'Edge'), ('opera', 'Opera'), ('ie', 'Internet Explorer')
        ]
        for key, name in browsers:
            if key in ua:
                return name
        return 'Other'
    
    @staticmethod
    def _get_os(user_agent):
        """OS-Erkennung"""
        ua = user_agent.lower()
        systems = [
            ('windows', 'Windows'), ('macintosh', 'macOS'), ('linux', 'Linux'),
            ('android', 'Android'), ('ios', 'iOS')
        ]
        for key, name in systems:
            if key in ua:
                return name
        return 'Other'
    
    @staticmethod
    def _extract_domain(url):
        """Extrahiert Domain aus URL ohne Query-Parameter"""
        if not url:
            return ''
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.netloc
        except:
            return ''
    
    @staticmethod
    def _get_country_from_ip(ip):
        """Vereinfachte GeoIP (könnte mit geoip2 erweitert werden)"""
        # Für MVP: nur leer zurückgeben oder einfache Logik
        # Für Produktion: django-geoip2 oder ähnliches verwenden
        return ''
    
    @staticmethod
    def _update_daily_stats(site, date):
        """Aktualisiert die Tagesstatistiken"""
        views = PageView.objects.filter(site=site, date=date)
        
        # Aggregieren
        total = views.count()
        
        # Unique visitors (vereinfacht: unique Kombination aus anonymen Merkmalen)
        # In Produktion: Session-ID oder Hash aus IP + User-Agent
        unique = views.values('country', 'device_type', 'browser_family').distinct().count()
        
        # Top Seiten
        top_pages = list(
            views.values('page_path')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )
        
        # Devices
        devices = {
            item['device_type']: item['count']
            for item in views.values('device_type').annotate(count=Count('id'))
        }
        
        # Länder
        countries = {
            item['country']: item['count']
            for item in views.values('country').annotate(count=Count('id'))
            if item['country']
        }
        
        # Referrer
        referrers = {
            item['referrer_domain']: item['count']
            for item in views.values('referrer_domain').annotate(count=Count('id'))
            if item['referrer_domain']
        }
        
        DailyStats.objects.update_or_create(
            site=site,
            date=date,
            defaults={
                'total_views': total,
                'unique_visitors': unique,
                'top_pages': top_pages,
                'devices': devices,
                'countries': countries,
                'referrers': referrers,
            }
        )


class AnalyticsDashboard:
    """
    Dashboard-Daten für das Admin-Interface
    """
    
    @staticmethod
    def get_overview(site, days=30):
        """Übersicht für die letzten X Tage"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        stats = DailyStats.objects.filter(
            site=site,
            date__gte=start_date
        ).order_by('date')
        
        total_views = sum(s.total_views for s in stats)
        total_visitors = sum(s.unique_visitors for s in stats)
        
        # Trend (Vergleich mit Vorperiode)
        prev_start = start_date - timedelta(days=days)
        prev_stats = DailyStats.objects.filter(
            site=site,
            date__gte=prev_start,
            date__lt=start_date
        )
        prev_views = sum(s.total_views for s in prev_stats) if prev_stats else 1
        
        trend = ((total_views - prev_views) / prev_views * 100) if prev_views > 0 else 0
        
        return {
            'total_views': total_views,
            'total_visitors': total_visitors,
            'avg_daily_views': total_views // days if days > 0 else 0,
            'trend_percent': round(trend, 1),
            'trend_direction': 'up' if trend > 0 else 'down' if trend < 0 else 'stable',
            'period_days': days,
        }
    
    @staticmethod
    def get_chart_data(site, days=30):
        """Daten für Zeitverlauf-Charts"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        stats = DailyStats.objects.filter(
            site=site,
            date__gte=start_date
        ).order_by('date')
        
        return [
            {
                'date': s.date.isoformat(),
                'views': s.total_views,
                'visitors': s.unique_visitors,
            }
            for s in stats
        ]
    
    @staticmethod
    def get_top_pages(site, days=30, limit=10):
        """Top besuchte Seiten"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        return PageView.objects.filter(
            site=site,
            date__gte=start_date
        ).values('page_path').annotate(
            views=Count('id')
        ).order_by('-views')[:limit]
    
    @staticmethod
    def get_sources(site, days=30):
        """Traffic-Quellen"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        referrers = PageView.objects.filter(
            site=site,
            date__gte=start_date,
            referrer_domain__isnull=False
        ).exclude(referrer_domain='').values('referrer_domain').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        direct = PageView.objects.filter(
            site=site,
            date__gte=start_date,
            referrer_domain__in=['', None]
        ).count()
        
        return {
            'referrers': list(referrers),
            'direct': direct,
        }
