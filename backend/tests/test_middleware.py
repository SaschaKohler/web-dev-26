"""
TenantMiddleware tests.
"""
import pytest
from django.test import RequestFactory
from django.http import Http404, HttpResponse

from cms_pages.middleware import TenantMiddleware
from cms_pages.models import Site
from .conftest import UserFactory, SiteFactory


def dummy_view(request):
    return HttpResponse("ok")


def make_middleware():
    return TenantMiddleware(dummy_view)


def make_request(host):
    factory = RequestFactory()
    request = factory.get("/api/test/", SERVER_NAME=host)
    request.META["HTTP_HOST"] = host
    return request


# ---------------------------------------------------------------------------
# TenantMiddleware
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.middleware
class TestTenantMiddleware:

    def test_localhost_sets_site_none(self):
        mw = make_middleware()
        request = make_request("localhost")
        mw(request)
        assert request.site is None

    def test_localhost_with_port_sets_site_none(self):
        mw = make_middleware()
        request = make_request("localhost:8000")
        mw(request)
        assert request.site is None

    def test_127_0_0_1_sets_site_none(self):
        mw = make_middleware()
        request = make_request("127.0.0.1")
        mw(request)
        assert request.site is None

    def test_main_domain_sets_site_none(self):
        mw = make_middleware()
        for host in ["lsbwebsites.at", "www.lsbwebsites.at", "api.lsbwebsites.at"]:
            request = make_request(host)
            mw(request)
            assert request.site is None, f"Expected None for host {host}"

    def test_railway_domain_sets_site_none(self):
        mw = make_middleware()
        request = make_request("myapp.up.railway.app")
        mw(request)
        assert request.site is None

    def test_netlify_domain_sets_site_none(self):
        mw = make_middleware()
        request = make_request("myapp.netlify.app")
        mw(request)
        assert request.site is None

    def test_www_subdomain_sets_site_none(self):
        mw = make_middleware()
        request = make_request("www.lsbwebsites.at")
        mw(request)
        assert request.site is None

    def test_api_subdomain_sets_site_none(self):
        mw = make_middleware()
        request = make_request("api.lsbwebsites.at")
        mw(request)
        assert request.site is None

    def test_valid_tenant_subdomain_sets_site(self):
        owner = UserFactory.create(username="tenant_mw_owner")
        site = SiteFactory.create(owner=owner, subdomain="my-lsb")
        mw = make_middleware()
        request = make_request("my-lsb.lsbwebsites.at")
        mw(request)
        assert request.site is not None
        assert request.site.pk == site.pk

    def test_inactive_tenant_sets_site_none(self):
        owner = UserFactory.create(username="inactive_mw_owner")
        site = SiteFactory.create(owner=owner, subdomain="inactive-lsb")
        site.is_active = False
        site.save()
        mw = make_middleware()
        request = make_request("inactive-lsb.lsbwebsites.at")
        mw(request)
        assert request.site is None

    def test_unknown_subdomain_on_api_path_raises_404(self):
        mw = make_middleware()
        factory = RequestFactory()
        request = factory.get(
            "/api/pages/",
            SERVER_NAME="unknown-tenant.lsbwebsites.at"
        )
        request.META["HTTP_HOST"] = "unknown-tenant.lsbwebsites.at"
        with pytest.raises(Http404):
            mw(request)

    def test_unknown_subdomain_on_non_api_path_sets_none(self):
        mw = make_middleware()
        factory = RequestFactory()
        request = factory.get(
            "/",
            SERVER_NAME="ghost.lsbwebsites.at"
        )
        request.META["HTTP_HOST"] = "ghost.lsbwebsites.at"
        mw(request)
        assert request.site is None

    def test_host_without_dot_sets_site_none(self):
        mw = make_middleware()
        request = make_request("nodot")
        mw(request)
        assert request.site is None

    def test_multiple_tenants_isolated(self):
        owner_a = UserFactory.create(username="tenant_a_owner")
        owner_b = UserFactory.create(username="tenant_b_owner")
        site_a = SiteFactory.create(owner=owner_a, subdomain="tenant-a")
        site_b = SiteFactory.create(owner=owner_b, subdomain="tenant-b")

        mw = make_middleware()

        req_a = make_request("tenant-a.lsbwebsites.at")
        mw(req_a)
        assert req_a.site.pk == site_a.pk

        req_b = make_request("tenant-b.lsbwebsites.at")
        mw(req_b)
        assert req_b.site.pk == site_b.pk
