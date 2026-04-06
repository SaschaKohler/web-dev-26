from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Page, DesignTemplate, SiteSettings, PageLayout, Section, ContentBlock, GlobalTemplate, NavigationItem
from .serializers import (
    PageSerializer, DesignTemplateSerializer, SiteSettingsSerializer,
    PageLayoutSerializer, SectionSerializer, ContentBlockSerializer, PageDetailSerializer,
    GlobalTemplateSerializer, NavigationItemSerializer
)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    filterset_fields = ['slug']
    
    def get_queryset(self):
        queryset = Page.objects.filter(is_published=True)
        slug = self.request.query_params.get('slug', None)
        if slug is not None:
            queryset = queryset.filter(slug=slug)
        return queryset
    
    @action(detail=False, methods=['get'])
    def all_pages(self, request):
        """Get all pages including unpublished ones (for admin/editor use)"""
        pages = Page.objects.all().order_by('-updated_at')
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def list_for_linking(self, request):
        """Get a simple list of pages for internal linking"""
        pages = Page.objects.filter(is_published=True).values('id', 'title', 'slug')
        return Response(list(pages))


class DesignTemplateViewSet(viewsets.ModelViewSet):
    queryset = DesignTemplate.objects.all()
    serializer_class = DesignTemplateSerializer
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        template = self.get_object()
        template.is_active = True
        template.save()
        
        settings = SiteSettings.get_settings()
        settings.active_template = template
        settings.save()
        
        return Response({
            'status': 'template activated',
            'template': DesignTemplateSerializer(template).data
        })
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        try:
            template = DesignTemplate.objects.get(is_active=True)
            return Response(DesignTemplateSerializer(template).data)
        except DesignTemplate.DoesNotExist:
            return Response({'error': 'No active template'}, status=status.HTTP_404_NOT_FOUND)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        settings = SiteSettings.get_settings()
        return Response(SiteSettingsSerializer(settings).data)
    
    @action(detail=False, methods=['patch'])
    def update_current(self, request):
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PageLayoutViewSet(viewsets.ModelViewSet):
    queryset = PageLayout.objects.all()
    serializer_class = PageLayoutSerializer
    
    @action(detail=True, methods=['get'])
    def with_sections(self, request, pk=None):
        layout = self.get_object()
        serializer = PageLayoutSerializer(layout)
        return Response(serializer.data)


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_queryset(self):
        queryset = Section.objects.all()
        layout_id = self.request.query_params.get('layout_id', None)
        if layout_id is not None:
            queryset = queryset.filter(page_layout_id=layout_id)
        return queryset


class ContentBlockViewSet(viewsets.ModelViewSet):
    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer
    
    def get_queryset(self):
        queryset = ContentBlock.objects.all()
        section_id = self.request.query_params.get('section_id', None)
        if section_id is not None:
            queryset = queryset.filter(section_id=section_id)
        return queryset


class GlobalTemplateViewSet(viewsets.ModelViewSet):
    queryset = GlobalTemplate.objects.all()
    serializer_class = GlobalTemplateSerializer
    
    def get_queryset(self):
        queryset = GlobalTemplate.objects.filter(is_active=True)
        template_type = self.request.query_params.get('template_type', None)
        if template_type is not None:
            queryset = queryset.filter(template_type=template_type)
        return queryset
    
    @action(detail=False, methods=['get'])
    def header(self, request):
        try:
            template = GlobalTemplate.objects.get(template_type='header', is_active=True)
            return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            return Response({'error': 'No active header template'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def navigation(self, request):
        try:
            template = GlobalTemplate.objects.get(template_type='navigation', is_active=True)
            return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            return Response({'error': 'No active navigation template'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def footer(self, request):
        try:
            template = GlobalTemplate.objects.get(template_type='footer', is_active=True)
            return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            return Response({'error': 'No active footer template'}, status=status.HTTP_404_NOT_FOUND)


class NavigationItemViewSet(viewsets.ModelViewSet):
    queryset = NavigationItem.objects.all()
    serializer_class = NavigationItemSerializer
    
    def get_queryset(self):
        queryset = NavigationItem.objects.filter(is_visible=True)
        template_id = self.request.query_params.get('template_id', None)
        if template_id is not None:
            queryset = queryset.filter(global_template_id=template_id)
        return queryset