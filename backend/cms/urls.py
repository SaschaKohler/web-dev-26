"""
URL configuration for cms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cms_pages.views import (
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
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
