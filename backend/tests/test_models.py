"""
Model-level tests for cms_pages models.
"""
import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone

from cms_pages.models import (
    Site, Page, DesignTemplate, SiteSettings, PageLayout,
    Section, ContentBlock, GlobalTemplate, NavigationItem, DecadeTheme,
)
from .conftest import (
    UserFactory, SiteFactory, DesignTemplateFactory, PageLayoutFactory,
    PageFactory, SectionFactory, ContentBlockFactory,
    GlobalTemplateFactory, DecadeThemeFactory,
)


# ---------------------------------------------------------------------------
# Site
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestSiteModel:

    def test_create_site(self):
        owner = UserFactory.create(username="site_owner")
        site = SiteFactory.create(owner=owner, subdomain="my-site")
        assert site.pk is not None
        assert site.subdomain == "my-site"
        assert site.owner == owner
        assert site.is_active is True

    def test_str_representation(self):
        site = SiteFactory.create(subdomain="demo")
        assert "demo" in str(site)

    def test_get_full_domain_with_custom_domain(self):
        site = SiteFactory.create(subdomain="lsb", domain="www.custom.at")
        assert site.get_full_domain() == "www.custom.at"

    def test_get_full_domain_without_custom_domain(self):
        site = SiteFactory.create(subdomain="lsb")
        assert site.get_full_domain() == "lsb.lsbwebsites.at"

    def test_subdomain_unique(self):
        owner = UserFactory.create(username="unique_owner")
        SiteFactory.create(owner=owner, subdomain="duplicate")
        with pytest.raises(Exception):
            SiteFactory.create(
                owner=UserFactory.create(username="second_owner"),
                subdomain="duplicate",
            )

    def test_plan_choices(self):
        valid_plans = ["starter", "pro", "premium"]
        for plan in valid_plans:
            site = SiteFactory.create(
                subdomain=f"plan-{plan}",
                owner=UserFactory.create(username=f"owner_{plan}"),
                plan=plan,
            )
            assert site.plan == plan

    def test_created_at_auto_set(self):
        site = SiteFactory.create(subdomain="ts-created")
        assert site.created_at is not None

    def test_updated_at_changes_on_save(self):
        site = SiteFactory.create(subdomain="ts-updated")
        old_ts = site.updated_at
        site.site_name = "Updated Name"
        site.save()
        site.refresh_from_db()
        assert site.updated_at >= old_ts


# ---------------------------------------------------------------------------
# DesignTemplate
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestDesignTemplateModel:

    def test_create_template(self):
        tmpl = DesignTemplateFactory.create()
        assert tmpl.pk is not None
        assert tmpl.name == "test-template"

    def test_str_representation(self):
        tmpl = DesignTemplateFactory.create(display_name="My Theme")
        assert str(tmpl) == "My Theme"

    def test_only_one_active_template(self):
        t1 = DesignTemplateFactory.create(name="t1", is_active=True)
        t2 = DesignTemplateFactory.create(name="t2", is_active=True)
        t1.refresh_from_db()
        assert t1.is_active is False
        assert t2.is_active is True

    def test_color_validator(self):
        tmpl = DesignTemplate(
            name="bad-color",
            display_name="Bad",
            description="x",
            primary_color="not-a-color",
        )
        with pytest.raises(ValidationError):
            tmpl.full_clean()


# ---------------------------------------------------------------------------
# SiteSettings
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestSiteSettingsModel:

    def test_get_settings_creates_singleton(self):
        settings = SiteSettings.get_settings()
        assert settings.pk == 1

    def test_get_settings_returns_same_object(self):
        s1 = SiteSettings.get_settings()
        s2 = SiteSettings.get_settings()
        assert s1.pk == s2.pk

    def test_str_representation(self):
        settings = SiteSettings.get_settings()
        assert "Site Settings" in str(settings)

    def test_site_settings_linked_to_site(self):
        owner = UserFactory.create(username="settings_owner")
        site = SiteFactory.create(owner=owner, subdomain="settings-site")
        ss = SiteSettings.objects.create(site=site, site_name="Linked Site")
        assert ss.site == site


# ---------------------------------------------------------------------------
# PageLayout
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestPageLayoutModel:

    def test_create_layout(self):
        layout = PageLayoutFactory.create()
        assert layout.pk is not None
        assert layout.name == "test-layout"

    def test_str_representation(self):
        layout = PageLayoutFactory.create(display_name="My Layout")
        assert str(layout) == "My Layout"

    def test_layout_type_choices(self):
        for lt in ["landing", "about", "services", "portfolio", "contact", "custom"]:
            layout = PageLayoutFactory.create(
                name=f"layout-{lt}",
                display_name=f"Layout {lt}",
                layout_type=lt,
            )
            assert layout.layout_type == lt


# ---------------------------------------------------------------------------
# Section
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestSectionModel:

    def test_create_section(self):
        section = SectionFactory.create()
        assert section.pk is not None
        assert section.section_type == "hero"

    def test_str_representation(self):
        layout = PageLayoutFactory.create(display_name="Landing")
        section = SectionFactory.create(page_layout=layout, section_type="hero")
        assert "Landing" in str(section)
        assert "Hero" in str(section)

    def test_section_ordering(self):
        layout = PageLayoutFactory.create(name="ord-layout", display_name="Ord Layout")
        s1 = SectionFactory.create(page_layout=layout, order=2)
        s2 = SectionFactory.create(page_layout=layout, order=0)
        s3 = SectionFactory.create(page_layout=layout, order=1)
        sections = list(Section.objects.filter(page_layout=layout))
        assert sections[0] == s2
        assert sections[1] == s3
        assert sections[2] == s1


# ---------------------------------------------------------------------------
# ContentBlock
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestContentBlockModel:

    def test_create_block(self):
        block = ContentBlockFactory.create()
        assert block.pk is not None
        assert block.block_type == "text"

    def test_get_link_url_external(self):
        block = ContentBlockFactory.create(
            link_type="external",
            link_url="https://example.com",
        )
        assert block.get_link_url() == "https://example.com"

    def test_get_link_url_internal(self):
        site = SiteFactory.create(
            subdomain="link-site",
            owner=UserFactory.create(username="link_owner"),
        )
        target_page = PageFactory.create(site=site, slug="about", title="About")
        section = SectionFactory.create()
        block = ContentBlockFactory.create(
            section=section,
            link_type="internal",
            internal_page=target_page,
        )
        assert block.get_link_url() == "/about"

    def test_get_link_url_none(self):
        block = ContentBlockFactory.create(link_type="none")
        assert block.get_link_url() is None

    def test_metadata_defaults_to_empty_dict(self):
        block = ContentBlockFactory.create()
        assert block.metadata == {}


# ---------------------------------------------------------------------------
# Page
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestPageModel:

    def test_create_page(self):
        page = PageFactory.create()
        assert page.pk is not None
        assert page.title == "Test Page"
        assert page.is_published is True
        assert page.is_trashed is False

    def test_str_representation(self):
        page = PageFactory.create(title="About Us")
        assert str(page) == "About Us"

    def test_get_meta_title_uses_title_as_fallback(self):
        page = PageFactory.create(title="My Page", meta_title="")
        assert page.get_meta_title() == "My Page"

    def test_get_meta_title_uses_custom_meta_title(self):
        page = PageFactory.create(title="My Page", meta_title="Custom SEO Title")
        assert page.get_meta_title() == "Custom SEO Title"

    def test_get_meta_description_fallback(self):
        page = PageFactory.create(content="Long content here", meta_description="")
        assert page.get_meta_description() == "Long content here"[:160]

    def test_get_meta_description_custom(self):
        page = PageFactory.create(meta_description="Custom description")
        assert page.get_meta_description() == "Custom description"

    def test_trash_sets_trashed_at(self):
        page = PageFactory.create()
        page.is_trashed = True
        page.trashed_at = timezone.now()
        page.save()
        page.refresh_from_db()
        assert page.is_trashed is True
        assert page.trashed_at is not None

    def test_structured_data_defaults_to_empty_dict(self):
        page = PageFactory.create()
        assert page.structured_data == {}


# ---------------------------------------------------------------------------
# GlobalTemplate
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestGlobalTemplateModel:

    def test_create_header_template(self):
        tmpl = GlobalTemplateFactory.create(template_type="header")
        assert tmpl.pk is not None
        assert tmpl.template_type == "header"

    def test_str_representation(self):
        tmpl = GlobalTemplateFactory.create(
            template_type="footer", display_name="Main Footer"
        )
        assert "Footer" in str(tmpl)
        assert "Main Footer" in str(tmpl)

    def test_metadata_defaults(self):
        tmpl = GlobalTemplateFactory.create()
        assert tmpl.metadata == {}


# ---------------------------------------------------------------------------
# NavigationItem
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestNavigationItemModel:

    def test_create_nav_item(self):
        tmpl = GlobalTemplateFactory.create(template_type="navigation",
                                             name="nav-tmpl",
                                             display_name="Nav Template")
        nav = NavigationItem.objects.create(
            global_template=tmpl,
            label="Home",
            url="/",
            order=0,
        )
        assert nav.pk is not None
        assert nav.label == "Home"

    def test_nested_nav_items(self):
        tmpl = GlobalTemplateFactory.create(template_type="navigation",
                                             name="nested-nav",
                                             display_name="Nested Nav")
        parent = NavigationItem.objects.create(
            global_template=tmpl, label="Parent", url="#", order=0
        )
        child = NavigationItem.objects.create(
            global_template=tmpl, label="Child", url="/child",
            order=0, parent=parent,
        )
        assert child.parent == parent
        assert child in parent.children.all()

    def test_str_representation(self):
        tmpl = GlobalTemplateFactory.create(template_type="navigation",
                                             name="str-nav",
                                             display_name="Str Nav")
        nav = NavigationItem.objects.create(
            global_template=tmpl, label="Contact", url="/contact", order=0
        )
        assert "Contact" in str(nav)


# ---------------------------------------------------------------------------
# DecadeTheme
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.models
class TestDecadeThemeModel:

    def test_create_theme(self):
        theme = DecadeThemeFactory.create()
        assert theme.pk is not None
        assert theme.decade == "90s"
        assert theme.variation == 1

    def test_theme_id_unique(self):
        DecadeThemeFactory.create(theme_id="90s-1")
        with pytest.raises(Exception):
            DecadeThemeFactory.create(theme_id="90s-1", name="Duplicate")

    def test_only_one_active_decade_theme(self):
        t1 = DecadeThemeFactory.create(theme_id="90s-x1", is_active=True)
        t2 = DecadeThemeFactory.create(theme_id="90s-x2", name="Second",
                                        is_active=True)
        t1.refresh_from_db()
        assert t1.is_active is False
        assert t2.is_active is True

    def test_str_representation(self):
        theme = DecadeThemeFactory.create(name="Neon Nights", decade="90s")
        assert "Neon Nights" in str(theme)
        assert "90s" in str(theme)

    def test_color_validator(self):
        theme = DecadeTheme(
            theme_id="bad-theme",
            name="Bad",
            description="x",
            decade="90s",
            variation=9,
            primary_color="INVALID",
            secondary_color="#ffffff",
            background_color="#000000",
            text_color="#eeeeee",
            font_family="Arial",
            heading_font="Arial",
            card_shadow="none",
        )
        with pytest.raises(ValidationError):
            theme.full_clean()
