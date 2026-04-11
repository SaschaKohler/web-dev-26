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
from cms_pages.jwt_auth_views import (
    login_view, logout_view, current_user_view, refresh_token_view, 
    csrf_token_view, UserViewSet
)
from cms_pages.onboarding_views import onboarding_view
from cms_pages.stripe_views import create_checkout_session, verify_session, stripe_webhook, get_stripe_config
from cms_pages.analytics_views import (
    analytics_overview, analytics_chart, analytics_pages,
    analytics_sources, analytics_realtime
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
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/refresh/', refresh_token_view, name='refresh-token'),
    path('api/auth/user/', current_user_view, name='current-user'),
    path('api/auth/csrf/', csrf_token_view, name='csrf-token'),
    path('api/onboard/', onboarding_view, name='onboard'),
    # Stripe endpoints
    path('api/stripe/create-checkout/', create_checkout_session, name='stripe-create-checkout'),
    path('api/stripe/verify-session/', verify_session, name='stripe-verify-session'),
    path('api/stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path('api/stripe/config/', get_stripe_config, name='stripe-config'),
    # Analytics endpoints
    path('api/analytics/overview/', analytics_overview, name='analytics-overview'),
    path('api/analytics/chart/', analytics_chart, name='analytics-chart'),
    path('api/analytics/pages/', analytics_pages, name='analytics-pages'),
    path('api/analytics/sources/', analytics_sources, name='analytics-sources'),
    path('api/analytics/realtime/', analytics_realtime, name='analytics-realtime'),
]
