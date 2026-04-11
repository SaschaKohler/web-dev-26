from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Page, DesignTemplate, SiteSettings, PageLayout, Section, ContentBlock, GlobalTemplate, NavigationItem, DecadeTheme, Site
from .serializers import (
    PageSerializer, DesignTemplateSerializer, SiteSettingsSerializer,
    PageLayoutSerializer, SectionSerializer, ContentBlockSerializer, PageDetailSerializer,
    GlobalTemplateSerializer, NavigationItemSerializer, DecadeThemeSerializer, SiteSerializer
)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    filterset_fields = ['slug']
    
    def get_queryset(self):
        # Filter by tenant site, exclude trashed
        site = getattr(self.request, 'site', None)
        if site:
            queryset = Page.objects.filter(site=site, is_published=True, is_trashed=False)
        else:
            queryset = Page.objects.filter(is_published=True, is_trashed=False)
        
        slug = self.request.query_params.get('slug', None)
        if slug is not None:
            queryset = queryset.filter(slug=slug)
        return queryset
    
    def perform_create(self, serializer):
        # Auto-assign site on creation
        site = getattr(self.request, 'site', None)
        if site:
            serializer.save(site=site)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def all_pages(self, request):
        """Get all pages including unpublished ones, excluding trashed (for admin/editor use)"""
        site = getattr(request, 'site', None)
        if site:
            pages = (Page.objects.filter(site=site, is_trashed=False).order_by('-updated_at') |
                     Page.objects.filter(site__isnull=True, is_trashed=False).order_by('-updated_at'))
        else:
            pages = Page.objects.filter(is_trashed=False).order_by('-updated_at')
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trashed(self, request):
        """Get all trashed pages (for trash view)"""
        site = getattr(request, 'site', None)
        if site:
            pages = (Page.objects.filter(site=site, is_trashed=True).order_by('-trashed_at') |
                     Page.objects.filter(site__isnull=True, is_trashed=True).order_by('-trashed_at'))
        else:
            pages = Page.objects.filter(is_trashed=True).order_by('-trashed_at')
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def trash(self, request, pk=None):
        """Move page to trash and remove all navigation items pointing to this page"""
        page = self.get_object()
        page.is_trashed = True
        page.trashed_at = timezone.now()
        page.save()
        # Remove nav items pointing to this page's slug
        page_url = f'/{page.slug}'
        deleted_nav, _ = NavigationItem.objects.filter(url=page_url, is_external=False).delete()
        return Response({'status': 'trashed', 'nav_items_removed': deleted_nav})

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore page from trash"""
        page = Page.objects.get(pk=pk)
        page.is_trashed = False
        page.trashed_at = None
        page.save()
        return Response({'status': 'restored'})

    @action(detail=False, methods=['delete'])
    def empty_trash(self, request):
        """Permanently delete all trashed pages"""
        site = getattr(request, 'site', None)
        if site:
            count, _ = Page.objects.filter(site=site, is_trashed=True).delete()
        else:
            count, _ = Page.objects.filter(is_trashed=True).delete()
        return Response({'deleted': count})
    
    @action(detail=False, methods=['get'])
    def list_for_linking(self, request):
        """Get a simple list of pages for internal linking"""
        site = getattr(request, 'site', None)
        if site:
            pages = Page.objects.filter(site=site, is_published=True).values('id', 'title', 'slug')
        else:
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
    
    def get_queryset(self):
        site = getattr(self.request, 'site', None)
        if site:
            return SiteSettings.objects.filter(site=site)
        return SiteSettings.objects.all()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        site = getattr(request, 'site', None)
        if site:
            settings, created = SiteSettings.objects.get_or_create(site=site, defaults={'site_name': site.site_name})
        else:
            settings = SiteSettings.get_settings()
        return Response(SiteSettingsSerializer(settings).data)
    
    @action(detail=False, methods=['patch'])
    def update_current(self, request):
        site = getattr(request, 'site', None)
        if site:
            settings, created = SiteSettings.objects.get_or_create(site=site, defaults={'site_name': site.site_name})
        else:
            settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PageLayoutViewSet(viewsets.ModelViewSet):
    queryset = PageLayout.objects.all()
    serializer_class = PageLayoutSerializer
    
    def get_queryset(self):
        site = getattr(self.request, 'site', None)
        if site:
            return PageLayout.objects.filter(site=site)
        return PageLayout.objects.all()
    
    def perform_create(self, serializer):
        site = getattr(self.request, 'site', None)
        if site:
            serializer.save(site=site)
        else:
            serializer.save()
    
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
        site = getattr(self.request, 'site', None)
        queryset = GlobalTemplate.objects.filter(is_active=True)
        if site:
            queryset = queryset.filter(site=site)
        template_type = self.request.query_params.get('template_type', None)
        if template_type is not None:
            queryset = queryset.filter(template_type=template_type)
        return queryset
    
    def perform_create(self, serializer):
        site = getattr(self.request, 'site', None)
        if site:
            serializer.save(site=site)
        else:
            serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        nav_items_data = request.data.get('nav_items', None)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if nav_items_data is not None:
            instance.nav_items.all().delete()
            id_map = {}

            def create_items(items, parent_db_id=None):
                for item in items:
                    children = item.get('children', [])
                    nav_obj = NavigationItem.objects.create(
                        global_template=instance,
                        label=item.get('label', ''),
                        url=item.get('url', '#'),
                        order=item.get('order', 0),
                        parent_id=parent_db_id,
                        icon_name=item.get('icon_name', '') or '',
                        is_external=item.get('is_external', False),
                        is_visible=item.get('is_visible', True),
                    )
                    id_map[item.get('id')] = nav_obj.id
                    if children:
                        create_items(children, parent_db_id=nav_obj.id)

            create_items(nav_items_data)

        return Response(self.get_serializer(instance).data)

    @action(detail=False, methods=['get'])
    def header(self, request):
        site = getattr(request, 'site', None)
        queryset = GlobalTemplate.objects.filter(template_type='header', is_active=True)
        if site:
            queryset = queryset.filter(site=site)
        try:
            template = queryset.first()
            if template:
                return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            pass
        return Response({'error': 'No active header template'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def navigation(self, request):
        site = getattr(request, 'site', None)
        queryset = GlobalTemplate.objects.filter(template_type='navigation', is_active=True)
        if site:
            queryset = queryset.filter(site=site)
        try:
            template = queryset.first()
            if template:
                return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            pass
        return Response({'error': 'No active navigation template'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def footer(self, request):
        site = getattr(request, 'site', None)
        queryset = GlobalTemplate.objects.filter(template_type='footer', is_active=True)
        if site:
            queryset = queryset.filter(site=site)
        try:
            template = queryset.first()
            if template:
                return Response(GlobalTemplateSerializer(template).data)
        except GlobalTemplate.DoesNotExist:
            pass
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


class DecadeThemeViewSet(viewsets.ModelViewSet):
    queryset = DecadeTheme.objects.all()
    serializer_class = DecadeThemeSerializer
    
    def get_queryset(self):
        queryset = DecadeTheme.objects.all().order_by('decade', 'variation')
        decade = self.request.query_params.get('decade', None)
        if decade is not None:
            queryset = queryset.filter(decade=decade)
        return queryset
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a decade theme and update site settings"""
        theme = self.get_object()
        theme.is_active = True
        theme.save()
        
        # Update site settings with the theme_id
        settings = SiteSettings.get_settings()
        settings.decade_theme_id = theme.theme_id
        settings.save()
        
        return Response({
            'status': 'theme activated',
            'theme': DecadeThemeSerializer(theme).data
        })
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the currently active decade theme"""
        try:
            theme = DecadeTheme.objects.get(is_active=True)
            return Response(DecadeThemeSerializer(theme).data)
        except DecadeTheme.DoesNotExist:
            return Response({'error': 'No active theme'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def predefined(self, request):
        """Get all predefined (original) themes"""
        themes = DecadeTheme.objects.filter(is_predefined=True).order_by('decade', 'variation')
        serializer = DecadeThemeSerializer(themes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_decade(self, request):
        """Get themes grouped by decade"""
        decades = ['90s', '2000s', '2010s', '2020s']
        result = {}
        for decade in decades:
            themes = DecadeTheme.objects.filter(decade=decade, is_predefined=True).order_by('variation')
            result[decade] = DecadeThemeSerializer(themes, many=True).data
        return Response(result)


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    
    def get_queryset(self):
        # Superusers see all sites, others see their own
        if self.request.user.is_superuser:
            return Site.objects.all()
        return Site.objects.filter(owner=self.request.user)