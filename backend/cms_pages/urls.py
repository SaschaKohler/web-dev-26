from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PageViewSet, DesignTemplateViewSet, SiteSettingsViewSet,
    PageLayoutViewSet, SectionViewSet, ContentBlockViewSet,
    GlobalTemplateViewSet, NavigationItemViewSet, DecadeThemeViewSet
)

router = DefaultRouter()
router.register(r'pages', PageViewSet)
router.register(r'templates', DesignTemplateViewSet)
router.register(r'settings', SiteSettingsViewSet)
router.register(r'layouts', PageLayoutViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'blocks', ContentBlockViewSet)
router.register(r'global-templates', GlobalTemplateViewSet)
router.register(r'navigation-items', NavigationItemViewSet)
router.register(r'decade-themes', DecadeThemeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]