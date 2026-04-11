"""
Shared fixtures and factories for the entire test suite.
"""
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from cms_pages.models import (
    Site, Page, DesignTemplate, SiteSettings, PageLayout,
    Section, ContentBlock, GlobalTemplate, NavigationItem, DecadeTheme,
)


# ---------------------------------------------------------------------------
# Factories
# ---------------------------------------------------------------------------

class UserFactory:
    @staticmethod
    def create(username="testuser", password="testpass123", is_staff=False,
               is_superuser=False, **kwargs):
        user = User.objects.create_user(
            username=username,
            password=password,
            email=f"{username}@example.com",
            is_staff=is_staff,
            is_superuser=is_superuser,
            **kwargs,
        )
        return user

    @staticmethod
    def create_staff(username="staffuser", password="staffpass123", **kwargs):
        return UserFactory.create(username=username, password=password,
                                  is_staff=True, **kwargs)

    @staticmethod
    def create_superuser(username="admin", password="adminpass123", **kwargs):
        return UserFactory.create(username=username, password=password,
                                  is_staff=True, is_superuser=True, **kwargs)


class SiteFactory:
    @staticmethod
    def create(owner=None, subdomain="test-site", **kwargs):
        if owner is None:
            owner = UserFactory.create(username=f"owner_{subdomain}")
        return Site.objects.create(
            subdomain=subdomain,
            owner=owner,
            site_name="Test Site",
            plan="starter",
            is_active=True,
            **kwargs,
        )


class DesignTemplateFactory:
    @staticmethod
    def create(name="test-template", display_name="Test Template", **kwargs):
        return DesignTemplate.objects.create(
            name=name,
            display_name=display_name,
            description="A test design template",
            primary_color="#1976d2",
            secondary_color="#dc004e",
            accent_color="#f50057",
            background_color="#ffffff",
            text_color="#333333",
            **kwargs,
        )


class PageLayoutFactory:
    @staticmethod
    def create(name="test-layout", display_name="Test Layout",
               site=None, **kwargs):
        return PageLayout.objects.create(
            name=name,
            display_name=display_name,
            layout_type="custom",
            site=site,
            **kwargs,
        )


class PageFactory:
    @staticmethod
    def create(title="Test Page", slug="test-page", site=None,
               is_published=True, **kwargs):
        return Page.objects.create(
            title=title,
            slug=slug,
            content="Test page content.",
            site=site,
            is_published=is_published,
            **kwargs,
        )


class SectionFactory:
    @staticmethod
    def create(page_layout=None, section_type="hero", order=0, **kwargs):
        if page_layout is None:
            page_layout = PageLayoutFactory.create()
        return Section.objects.create(
            page_layout=page_layout,
            section_type=section_type,
            title="Test Section",
            order=order,
            **kwargs,
        )


class ContentBlockFactory:
    @staticmethod
    def create(section=None, block_type="text", order=0, **kwargs):
        if section is None:
            section = SectionFactory.create()
        return ContentBlock.objects.create(
            section=section,
            block_type=block_type,
            title="Test Block",
            content="Block content.",
            order=order,
            **kwargs,
        )


class GlobalTemplateFactory:
    @staticmethod
    def create(name="test-header", display_name="Test Header",
               template_type="header", site=None, **kwargs):
        return GlobalTemplate.objects.create(
            name=name,
            display_name=display_name,
            template_type=template_type,
            site=site,
            is_active=True,
            **kwargs,
        )


class DecadeThemeFactory:
    @staticmethod
    def create(theme_id="90s-1", name="Neon Nights", decade="90s",
               variation=1, **kwargs):
        return DecadeTheme.objects.create(
            theme_id=theme_id,
            name=name,
            description="A vibrant 90s theme",
            decade=decade,
            variation=variation,
            primary_color="#ff6b6b",
            secondary_color="#4ecdc4",
            background_color="#1a1a2e",
            text_color="#eee",
            accent_color="#ffd700",
            font_family="Arial, sans-serif",
            heading_font="Impact, sans-serif",
            border_radius=4,
            spacing_unit=8,
            card_shadow="0 2px 8px rgba(0,0,0,0.3)",
            button_style="rounded",
            is_predefined=True,
            **kwargs,
        )


# ---------------------------------------------------------------------------
# Pytest fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return UserFactory.create()


@pytest.fixture
def staff_user(db):
    return UserFactory.create_staff()


@pytest.fixture
def superuser(db):
    return UserFactory.create_superuser()


@pytest.fixture
def site(db, user):
    return SiteFactory.create(owner=user)


@pytest.fixture
def design_template(db):
    return DesignTemplateFactory.create()


@pytest.fixture
def page_layout(db, site):
    return PageLayoutFactory.create(site=site)


@pytest.fixture
def page(db, site):
    return PageFactory.create(site=site)


@pytest.fixture
def section(db, page_layout):
    return SectionFactory.create(page_layout=page_layout)


@pytest.fixture
def content_block(db, section):
    return ContentBlockFactory.create(section=section)


@pytest.fixture
def global_template(db, site):
    return GlobalTemplateFactory.create(site=site)


@pytest.fixture
def decade_theme(db):
    return DecadeThemeFactory.create()


@pytest.fixture
def auth_client(db, staff_user):
    """APIClient authenticated with a staff user JWT."""
    client = APIClient()
    refresh = RefreshToken.for_user(staff_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client


@pytest.fixture
def superuser_client(db, superuser):
    """APIClient authenticated with a superuser JWT."""
    client = APIClient()
    refresh = RefreshToken.for_user(superuser)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client


def get_tokens_for_user(user):
    """Helper: returns (access_token_str, refresh_token_str)."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)
