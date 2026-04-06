from rest_framework import serializers
from .models import Page, DesignTemplate, SiteSettings, PageLayout, Section, ContentBlock, GlobalTemplate, NavigationItem, DecadeTheme

class NavigationItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = NavigationItem
        fields = '__all__'
    
    def get_children(self, obj):
        children = obj.children.filter(is_visible=True).order_by('order')
        return NavigationItemSerializer(children, many=True).data


class GlobalTemplateSerializer(serializers.ModelSerializer):
    nav_items = NavigationItemSerializer(many=True, read_only=True)
    template_type_display = serializers.CharField(source='get_template_type_display', read_only=True)
    
    class Meta:
        model = GlobalTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PageSerializer(serializers.ModelSerializer):
    meta_title_computed = serializers.CharField(source='get_meta_title', read_only=True)
    meta_description_computed = serializers.CharField(source='get_meta_description', read_only=True)
    
    class Meta:
        model = Page
        fields = '__all__'


class DesignTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    active_template_details = DesignTemplateSerializer(source='active_template', read_only=True)
    
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['updated_at']


class ContentBlockSerializer(serializers.ModelSerializer):
    computed_link_url = serializers.CharField(source='get_link_url', read_only=True)
    internal_page_title = serializers.CharField(source='internal_page.title', read_only=True)
    internal_page_slug = serializers.CharField(source='internal_page.slug', read_only=True)
    
    class Meta:
        model = ContentBlock
        fields = '__all__'
        read_only_fields = []


class SectionSerializer(serializers.ModelSerializer):
    content_blocks = ContentBlockSerializer(many=True, read_only=True)
    section_type_display = serializers.CharField(source='get_section_type_display', read_only=True)
    background_type_display = serializers.CharField(source='get_background_type_display', read_only=True)
    
    class Meta:
        model = Section
        fields = '__all__'
        read_only_fields = []


class PageLayoutSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    layout_type_display = serializers.CharField(source='get_layout_type_display', read_only=True)
    
    class Meta:
        model = PageLayout
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PageDetailSerializer(serializers.ModelSerializer):
    layout_details = PageLayoutSerializer(source='layout', read_only=True)
    
    class Meta:
        model = Page
        fields = '__all__'


class DecadeThemeSerializer(serializers.ModelSerializer):
    decade_display = serializers.CharField(source='get_decade_display', read_only=True)
    button_style_display = serializers.CharField(source='get_button_style_display', read_only=True)
    
    class Meta:
        model = DecadeTheme
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']