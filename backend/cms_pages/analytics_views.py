"""
Analytics API Views for Dashboard
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from .analytics import AnalyticsDashboard
from .models import Site


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    """
    GET /api/analytics/overview/?days=30
    
    Overview stats for the current user's site
    """
    site = getattr(request, 'site', None)
    if not site:
        # Fallback: get site from user
        try:
            site = Site.objects.filter(owner=request.user).first()
        except:
            pass
    
    if not site:
        return Response(
            {'error': 'No site found for user'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    days = int(request.GET.get('days', 30))
    
    data = AnalyticsDashboard.get_overview(site, days)
    
    return Response({
        'success': True,
        'data': data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_chart(request):
    """
    GET /api/analytics/chart/?days=30
    
    Time-series data for charts
    """
    site = getattr(request, 'site', None) or Site.objects.filter(owner=request.user).first()
    
    if not site:
        return Response(
            {'error': 'No site found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    days = int(request.GET.get('days', 30))
    data = AnalyticsDashboard.get_chart_data(site, days)
    
    return Response({
        'success': True,
        'data': data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_pages(request):
    """
    GET /api/analytics/pages/?days=30&limit=10
    
    Top pages data
    """
    site = getattr(request, 'site', None) or Site.objects.filter(owner=request.user).first()
    
    if not site:
        return Response(
            {'error': 'No site found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    days = int(request.GET.get('days', 30))
    limit = int(request.GET.get('limit', 10))
    
    data = AnalyticsDashboard.get_top_pages(site, days, limit)
    
    return Response({
        'success': True,
        'data': list(data),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_sources(request):
    """
    GET /api/analytics/sources/?days=30
    
    Traffic sources
    """
    site = getattr(request, 'site', None) or Site.objects.filter(owner=request.user).first()
    
    if not site:
        return Response(
            {'error': 'No site found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    days = int(request.GET.get('days', 30))
    data = AnalyticsDashboard.get_sources(site, days)
    
    return Response({
        'success': True,
        'data': data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_realtime(request):
    """
    GET /api/analytics/realtime/
    
    Realtime stats (last 30 minutes)
    """
    from .analytics import PageView
    
    site = getattr(request, 'site', None) or Site.objects.filter(owner=request.user).first()
    
    if not site:
        return Response(
            {'error': 'No site found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Last 30 minutes
    since = timezone.now() - timedelta(minutes=30)
    
    recent_views = PageView.objects.filter(
        site=site,
        timestamp__gte=since
    )
    
    active_pages = recent_views.values('page_path').annotate(
        count=PageView.objects.Count('id')
    ).order_by('-count')[:5]
    
    return Response({
        'success': True,
        'data': {
            'active_last_30min': recent_views.count(),
            'top_active_pages': list(active_pages),
        },
    })
