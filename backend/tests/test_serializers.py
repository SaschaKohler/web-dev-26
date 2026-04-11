"""
Serializer tests for cms_pages serializers.
"""
import pytest
from cms_pages.serializers import (
    PageSerializer, DesignTemplateSerializer, SiteSettingsSerializer,
    PageLayoutSerializer, SectionSerializer, ContentBlockSerializer,
    GlobalTemplateSerializer, NavigationItemSerializer,
    DecadeThemeSerializer, SiteSerializer,
)
from cms_pages.models import SiteSettings
from .conftest import (
    UserFactory, SiteFactory, DesignTemplateFactory, PageLayoutFactory,
    PageFactory, SectionFactory, ContentBlockFactory,
    GlobalTemplateFactory, DecadeThemeFactory,
)


# ---------------------------------------------------------------------------
# PageSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestPageSerializer:

    def test_serializes_page_fields(self):
        page = PageFactory.create(title="Hello", slug="hello")
        data = PageSerializer(page).data
        assert data["title"] == "Hello"
        assert data["slug"] == "hello"
        assert data["is_published"] is True
        assert data["is_trashed"] is False

    def test_computed_meta_title_fallback(self):
        page = PageFactory.create(title="My Page", meta_title="")
        data = PageSerializer(page).data
        assert data["meta_title_computed"] == "My Page"

    def test_computed_meta_title_custom(self):
        page = PageFactory.create(title="My Page", meta_title="SEO Title")
        data = PageSerializer(page).data
        assert data["meta_title_computed"] == "SEO Title"

    def test_computed_meta_description_fallback(self):
        page = PageFactory.create(content="Short content", meta_description="")
        data = PageSerializer(page).data
        assert data["meta_description_computed"] == "Short content"

    def test_deserialize_valid_data(self):
        owner = UserFactory.create(username="page_deser_owner")
        site = SiteFactory.create(owner=owner, subdomain="page-deser")
        payload = {
            "title": "New Page",
            "slug": "new-page",
            "content": "Some content",
            "site": site.pk,
            "is_published": True,
        }
        serializer = PageSerializer(data=payload)
        assert serializer.is_valid(), serializer.errors

    def test_slug_is_required(self):
        payload = {"title": "No Slug", "content": "x"}
        serializer = PageSerializer(data=payload)
        assert not serializer.is_valid()
        assert "slug" in serializer.errors


# ---------------------------------------------------------------------------
# DesignTemplateSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestDesignTemplateSerializer:

    def test_serializes_all_fields(self):
        tmpl = DesignTemplateFactory.create()
        data = DesignTemplateSerializer(tmpl).data
        assert data["name"] == "test-template"
        assert data["primary_color"] == "#1976d2"
        assert "created_at" in data
        assert "updated_at" in data

    def test_created_at_is_read_only(self):
        tmpl = DesignTemplateFactory.create()
        payload = DesignTemplateSerializer(tmpl).data
        payload["created_at"] = "2000-01-01T00:00:00Z"
        serializer = DesignTemplateSerializer(tmpl, data=payload)
        assert serializer.is_valid()
        # read_only fields are silently ignored
        assert serializer.validated_data.get("created_at") is None


# ---------------------------------------------------------------------------
# SiteSettingsSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestSiteSettingsSerializer:

    def test_serializes_settings(self):
        settings = SiteSettings.get_settings()
        data = SiteSettingsSerializer(settings).data
        assert "site_name" in data
        assert "updated_at" in data

    def test_active_template_details_null_when_no_template(self):
        settings = SiteSettings.get_settings()
        data = SiteSettingsSerializer(settings).data
        assert data["active_template_details"] is None

    def test_active_template_details_populated(self):
        tmpl = DesignTemplateFactory.create()
        settings = SiteSettings.get_settings()
        settings.active_template = tmpl
        settings.save()
        data = SiteSettingsSerializer(settings).data
        assert data["active_template_details"]["name"] == "test-template"


# ---------------------------------------------------------------------------
# PageLayoutSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestPageLayoutSerializer:

    def test_serializes_layout_with_sections(self):
        layout = PageLayoutFactory.create()
        SectionFactory.create(page_layout=layout, section_type="hero")
        SectionFactory.create(page_layout=layout, section_type="cta")
        data = PageLayoutSerializer(layout).data
        assert len(data["sections"]) == 2
        assert data["layout_type_display"] is not None

    def test_nested_sections_have_content_blocks(self):
        layout = PageLayoutFactory.create(name="nested-l", display_name="Nested L")
        section = SectionFactory.create(page_layout=layout)
        ContentBlockFactory.create(section=section)
        data = PageLayoutSerializer(layout).data
        assert len(data["sections"][0]["content_blocks"]) == 1


# ---------------------------------------------------------------------------
# SectionSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestSectionSerializer:

    def test_serializes_section_type_display(self):
        section = SectionFactory.create(section_type="hero")
        data = SectionSerializer(section).data
        assert data["section_type_display"] == "Hero Section"

    def test_serializes_background_type_display(self):
        section = SectionFactory.create(background_type="gradient")
        data = SectionSerializer(section).data
        assert data["background_type_display"] == "Gradient"

    def test_content_blocks_nested(self):
        section = SectionFactory.create()
        ContentBlockFactory.create(section=section, block_type="text")
        ContentBlockFactory.create(section=section, block_type="image")
        data = SectionSerializer(section).data
        assert len(data["content_blocks"]) == 2


# ---------------------------------------------------------------------------
# ContentBlockSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestContentBlockSerializer:

    def test_computed_link_url_external(self):
        block = ContentBlockFactory.create(
            link_type="external", link_url="https://example.at"
        )
        data = ContentBlockSerializer(block).data
        assert data["computed_link_url"] == "https://example.at"

    def test_computed_link_url_none(self):
        block = ContentBlockFactory.create(link_type="none")
        data = ContentBlockSerializer(block).data
        assert data["computed_link_url"] is None

    def test_internal_page_slug_populated(self):
        owner = UserFactory.create(username="block_ser_owner")
        site = SiteFactory.create(owner=owner, subdomain="block-ser-site")
        target = PageFactory.create(site=site, slug="services", title="Services")
        section = SectionFactory.create()
        block = ContentBlockFactory.create(
            section=section, link_type="internal", internal_page=target
        )
        data = ContentBlockSerializer(block).data
        assert data["internal_page_slug"] == "services"
        assert data["internal_page_title"] == "Services"


# ---------------------------------------------------------------------------
# GlobalTemplateSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestGlobalTemplateSerializer:

    def test_serializes_nav_items(self):
        from cms_pages.models import NavigationItem
        tmpl = GlobalTemplateFactory.create(
            name="nav-ser", display_name="Nav Ser", template_type="navigation"
        )
        NavigationItem.objects.create(
            global_template=tmpl, label="Home", url="/", order=0
        )
        NavigationItem.objects.create(
            global_template=tmpl, label="About", url="/about", order=1
        )
        data = GlobalTemplateSerializer(tmpl).data
        assert len(data["nav_items"]) == 2

    def test_template_type_display(self):
        tmpl = GlobalTemplateFactory.create(template_type="footer",
                                             name="ft-ser", display_name="Ft Ser")
        data = GlobalTemplateSerializer(tmpl).data
        assert data["template_type_display"] == "Footer"

    def test_nested_nav_items_children(self):
        from cms_pages.models import NavigationItem
        tmpl = GlobalTemplateFactory.create(
            name="nested-ser", display_name="Nested Ser", template_type="navigation"
        )
        parent = NavigationItem.objects.create(
            global_template=tmpl, label="Products", url="#", order=0
        )
        NavigationItem.objects.create(
            global_template=tmpl, label="Widget", url="/widget",
            order=0, parent=parent
        )
        data = GlobalTemplateSerializer(tmpl).data
        parent_data = next(
            i for i in data["nav_items"] if i["label"] == "Products"
        )
        assert len(parent_data["children"]) == 1
        assert parent_data["children"][0]["label"] == "Widget"


# ---------------------------------------------------------------------------
# DecadeThemeSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestDecadeThemeSerializer:

    def test_decade_display(self):
        theme = DecadeThemeFactory.create(decade="90s")
        data = DecadeThemeSerializer(theme).data
        assert data["decade_display"] == "1990s"

    def test_button_style_display(self):
        theme = DecadeThemeFactory.create(button_style="pill")
        data = DecadeThemeSerializer(theme).data
        assert data["button_style_display"] == "Pill"

    def test_all_color_fields_present(self):
        theme = DecadeThemeFactory.create()
        data = DecadeThemeSerializer(theme).data
        for field in ["primary_color", "secondary_color", "background_color",
                      "text_color", "accent_color"]:
            assert field in data


# ---------------------------------------------------------------------------
# SiteSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.serializers
class TestSiteSerializer:

    def test_serializes_site_fields(self):
        owner = UserFactory.create(username="site_ser_owner")
        site = SiteFactory.create(owner=owner, subdomain="site-ser")
        data = SiteSerializer(site).data
        assert data["subdomain"] == "site-ser"
        assert "id" in data
        assert "plan" in data

    def test_owner_not_in_serializer(self):
        """owner FK should not be exposed in SiteSerializer."""
        owner = UserFactory.create(username="site_ser_owner2")
        site = SiteFactory.create(owner=owner, subdomain="site-ser2")
        data = SiteSerializer(site).data
        assert "owner" not in data

    def test_created_at_read_only(self):
        owner = UserFactory.create(username="site_ser_owner3")
        site = SiteFactory.create(owner=owner, subdomain="site-ser3")
        data = SiteSerializer(site).data
        assert "created_at" in data
