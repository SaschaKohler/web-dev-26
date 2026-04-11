"""
API ViewSet tests — Pages, DesignTemplates, SiteSettings,
PageLayouts, Sections, ContentBlocks, GlobalTemplates,
NavigationItems, DecadeThemes, Sites.
"""
import pytest
from django.urls import reverse
from rest_framework import status

from cms_pages.models import (
    Page, NavigationItem, SiteSettings, DesignTemplate, DecadeTheme,
)
from .conftest import (
    UserFactory, SiteFactory, DesignTemplateFactory, PageLayoutFactory,
    PageFactory, SectionFactory, ContentBlockFactory,
    GlobalTemplateFactory, DecadeThemeFactory,
)


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestPageViewSet:

    def test_list_published_pages(self, api_client, page):
        url = reverse("page-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        slugs = [p["slug"] for p in response.data]
        assert page.slug in slugs

    def test_list_excludes_trashed(self, api_client, page):
        page.is_trashed = True
        page.save()
        url = reverse("page-list")
        response = api_client.get(url)
        slugs = [p["slug"] for p in response.data]
        assert page.slug not in slugs

    def test_list_excludes_unpublished(self, api_client, site):
        unpublished = PageFactory.create(
            site=site, slug="draft-page", is_published=False
        )
        url = reverse("page-list")
        response = api_client.get(url)
        slugs = [p["slug"] for p in response.data]
        assert unpublished.slug not in slugs

    def test_filter_by_slug(self, api_client, page):
        url = reverse("page-list") + f"?slug={page.slug}"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["slug"] == page.slug

    def test_create_page(self, auth_client):
        url = reverse("page-list")
        payload = {"title": "New Page", "slug": "new-page", "content": "Content"}
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Page.objects.filter(slug="new-page").exists()

    def test_update_page(self, auth_client, page):
        url = reverse("page-detail", args=[page.pk])
        response = auth_client.patch(url, {"title": "Updated"}, format="json")
        assert response.status_code == status.HTTP_200_OK
        page.refresh_from_db()
        assert page.title == "Updated"

    def test_delete_page(self, auth_client, page):
        url = reverse("page-detail", args=[page.pk])
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Page.objects.filter(pk=page.pk).exists()

    def test_all_pages_action(self, auth_client, site):
        PageFactory.create(site=site, slug="pub", is_published=True)
        PageFactory.create(site=site, slug="draft", is_published=False)
        url = reverse("page-all-pages")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        slugs = [p["slug"] for p in response.data]
        assert "pub" in slugs
        assert "draft" in slugs

    def test_trashed_action(self, auth_client, site):
        p = PageFactory.create(site=site, slug="to-trash")
        p.is_trashed = True
        p.save()
        url = reverse("page-trashed")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        slugs = [pg["slug"] for pg in response.data]
        assert "to-trash" in slugs

    def test_trash_action(self, auth_client, page):
        url = reverse("page-trash", args=[page.pk])
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "trashed"
        page.refresh_from_db()
        assert page.is_trashed is True

    def test_trash_removes_nav_items(self, auth_client, page):
        tmpl = GlobalTemplateFactory.create(
            name="trash-nav", display_name="Trash Nav", template_type="navigation"
        )
        NavigationItem.objects.create(
            global_template=tmpl, label="Page Link",
            url=f"/{page.slug}", order=0, is_external=False
        )
        url = reverse("page-trash", args=[page.pk])
        response = auth_client.post(url)
        assert response.data["nav_items_removed"] == 1
        assert not NavigationItem.objects.filter(url=f"/{page.slug}").exists()

    def test_restore_action(self, auth_client, page):
        page.is_trashed = True
        page.save()
        url = reverse("page-restore", args=[page.pk])
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        page.refresh_from_db()
        assert page.is_trashed is False

    def test_empty_trash_action(self, auth_client, site):
        p1 = PageFactory.create(site=site, slug="trash1")
        p2 = PageFactory.create(site=site, slug="trash2")
        for p in [p1, p2]:
            p.is_trashed = True
            p.save()
        url = reverse("page-empty-trash")
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["deleted"] >= 2

    def test_list_for_linking(self, auth_client, page):
        url = reverse("page-list-for-linking")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        ids = [p["id"] for p in response.data]
        assert page.pk in ids


# ---------------------------------------------------------------------------
# DesignTemplates
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestDesignTemplateViewSet:

    def test_list_templates(self, api_client, design_template):
        url = reverse("designtemplate-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        names = [t["name"] for t in response.data]
        assert "test-template" in names

    def test_create_template(self, auth_client):
        url = reverse("designtemplate-list")
        payload = {
            "name": "brand-new",
            "display_name": "Brand New",
            "description": "A new template",
            "primary_color": "#aabbcc",
            "secondary_color": "#112233",
            "accent_color": "#998877",
            "background_color": "#ffffff",
            "text_color": "#000000",
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED

    def test_activate_template_action(self, auth_client, design_template):
        url = reverse("designtemplate-activate", args=[design_template.pk])
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "template activated"
        design_template.refresh_from_db()
        assert design_template.is_active is True

    def test_active_action_returns_404_when_none(self, api_client):
        DesignTemplate.objects.all().delete()
        url = reverse("designtemplate-active")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_active_action_returns_active_template(self, api_client, design_template):
        design_template.is_active = True
        design_template.save()
        url = reverse("designtemplate-active")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "test-template"


# ---------------------------------------------------------------------------
# SiteSettings
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestSiteSettingsViewSet:

    def test_current_returns_settings(self, api_client):
        url = reverse("sitesettings-current")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert "site_name" in response.data

    def test_update_current(self, auth_client):
        url = reverse("sitesettings-update-current")
        response = auth_client.patch(
            url, {"site_name": "Updated Name"}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["site_name"] == "Updated Name"

    def test_update_current_invalid_data(self, auth_client):
        url = reverse("sitesettings-update-current")
        # contact_email must be valid email
        response = auth_client.patch(
            url, {"contact_email": "not-an-email"}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# PageLayouts
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestPageLayoutViewSet:

    def test_list_layouts(self, api_client, page_layout):
        url = reverse("pagelayout-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        names = [l["name"] for l in response.data]
        assert "test-layout" in names

    def test_create_layout(self, auth_client):
        url = reverse("pagelayout-list")
        payload = {
            "name": "hero-layout",
            "display_name": "Hero Layout",
            "layout_type": "landing",
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED

    def test_with_sections_action(self, auth_client, page_layout, section):
        url = reverse("pagelayout-with-sections", args=[page_layout.pk])
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["sections"]) >= 1

    def test_delete_layout(self, auth_client, page_layout):
        url = reverse("pagelayout-detail", args=[page_layout.pk])
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestSectionViewSet:

    def test_list_sections(self, api_client, section):
        url = reverse("section-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_filter_by_layout_id(self, api_client, page_layout, section):
        url = reverse("section-list") + f"?layout_id={page_layout.pk}"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        for s in response.data:
            assert s["page_layout"] == page_layout.pk

    def test_create_section(self, auth_client, page_layout):
        url = reverse("section-list")
        payload = {
            "page_layout": page_layout.pk,
            "section_type": "cta",
            "title": "CTA Section",
            "order": 1,
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED

    def test_update_section_order(self, auth_client, section):
        url = reverse("section-detail", args=[section.pk])
        response = auth_client.patch(url, {"order": 99}, format="json")
        assert response.status_code == status.HTTP_200_OK
        section.refresh_from_db()
        assert section.order == 99


# ---------------------------------------------------------------------------
# ContentBlocks
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestContentBlockViewSet:

    def test_list_blocks(self, api_client, content_block):
        url = reverse("contentblock-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_filter_by_section_id(self, api_client, section, content_block):
        url = reverse("contentblock-list") + f"?section_id={section.pk}"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        for b in response.data:
            assert b["section"] == section.pk

    def test_create_block(self, auth_client, section):
        url = reverse("contentblock-list")
        payload = {
            "section": section.pk,
            "block_type": "card",
            "title": "A Card",
            "order": 0,
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED

    def test_delete_block(self, auth_client, content_block):
        url = reverse("contentblock-detail", args=[content_block.pk])
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT


# ---------------------------------------------------------------------------
# GlobalTemplates
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestGlobalTemplateViewSet:

    def test_list_active_templates(self, api_client, global_template):
        url = reverse("globaltemplate-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        names = [t["name"] for t in response.data]
        assert global_template.name in names

    def test_filter_by_template_type(self, api_client, site):
        GlobalTemplateFactory.create(
            name="hdr", display_name="Hdr", template_type="header", site=site
        )
        GlobalTemplateFactory.create(
            name="ftr", display_name="Ftr", template_type="footer", site=site
        )
        url = reverse("globaltemplate-list") + "?template_type=header"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        for t in response.data:
            assert t["template_type"] == "header"

    def test_header_action(self, api_client, site):
        GlobalTemplateFactory.create(
            name="main-header", display_name="Main Header",
            template_type="header", site=site
        )
        url = reverse("globaltemplate-header")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_footer_action(self, api_client, site):
        GlobalTemplateFactory.create(
            name="main-footer", display_name="Main Footer",
            template_type="footer", site=site
        )
        url = reverse("globaltemplate-footer")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_navigation_action(self, api_client, site):
        GlobalTemplateFactory.create(
            name="main-nav", display_name="Main Nav",
            template_type="navigation", site=site
        )
        url = reverse("globaltemplate-navigation")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_update_with_nav_items(self, auth_client, global_template):
        url = reverse("globaltemplate-detail", args=[global_template.pk])
        payload = {
            "name": global_template.name,
            "display_name": global_template.display_name,
            "template_type": global_template.template_type,
            "nav_items": [
                {"label": "Home", "url": "/", "order": 0, "children": []},
                {"label": "About", "url": "/about", "order": 1, "children": []},
            ],
        }
        response = auth_client.put(url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["nav_items"]) == 2

    def test_header_action_returns_404_when_none(self, api_client):
        from cms_pages.models import GlobalTemplate
        GlobalTemplate.objects.filter(template_type="header").delete()
        url = reverse("globaltemplate-header")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND


# ---------------------------------------------------------------------------
# DecadeThemes
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.api
class TestDecadeThemeViewSet:

    def test_list_themes(self, api_client, decade_theme):
        url = reverse("decadetheme-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        ids = [t["theme_id"] for t in response.data]
        assert "90s-1" in ids

    def test_filter_by_decade(self, api_client):
        DecadeThemeFactory.create(theme_id="2000s-filter-1", decade="2000s",
                                   name="Y2K Theme", variation=1)
        url = reverse("decadetheme-list") + "?decade=2000s"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        for t in response.data:
            assert t["decade"] == "2000s"

    def test_activate_theme(self, auth_client, decade_theme):
        url = reverse("decadetheme-activate", args=[decade_theme.pk])
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "theme activated"
        decade_theme.refresh_from_db()
        assert decade_theme.is_active is True

    def test_active_action_no_active_theme(self, api_client):
        DecadeTheme.objects.all().update(is_active=False)
        url = reverse("decadetheme-active")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_active_action_returns_active_theme(self, api_client, decade_theme):
        decade_theme.is_active = True
        decade_theme.save()
        url = reverse("decadetheme-active")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["theme_id"] == "90s-1"

    def test_predefined_action(self, api_client, decade_theme):
        url = reverse("decadetheme-predefined")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        for t in response.data:
            assert t["is_predefined"] is True

    def test_by_decade_action(self, api_client, decade_theme):
        url = reverse("decadetheme-by-decade")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert "90s" in response.data
        assert "2000s" in response.data
        assert "2010s" in response.data
        assert "2020s" in response.data
