from django.contrib import admin
from .models import Page, DesignTemplate, SiteSettings, PageLayout, Section, ContentBlock, GlobalTemplate, NavigationItem

class ContentBlockInline(admin.TabularInline):
    model = ContentBlock
    extra = 1
    fields = ['block_type', 'title', 'subtitle', 'content', 'image_url', 'video_url', 'link_url', 'link_text', 'icon_name', 'order', 'is_visible']
    ordering = ['order']

class SectionInline(admin.StackedInline):
    model = Section
    extra = 1
    fields = ['section_type', 'title', 'subtitle', 'order', 'background_type', 'background_color', 'background_image', 'padding_top', 'padding_bottom', 'is_full_width', 'is_visible']
    ordering = ['order']
    show_change_link = True

class NavigationItemInline(admin.TabularInline):
    model = NavigationItem
    extra = 1
    fields = ['label', 'url', 'order', 'parent', 'icon_name', 'is_external', 'is_visible']
    ordering = ['order']

@admin.register(GlobalTemplate)
class GlobalTemplateAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'template_type', 'style', 'is_active', 'updated_at']
    list_filter = ['template_type', 'is_active']
    search_fields = ['name', 'display_name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [NavigationItemInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'display_name', 'template_type', 'is_active')
        }),
        ('Branding', {
            'fields': ('logo_url', 'logo_alt', 'style')
        }),
        ('Styling', {
            'fields': ('background_color', 'text_color')
        }),
        ('Display Options', {
            'fields': ('show_social_links', 'show_contact_info')
        }),
        ('Custom Code', {
            'fields': ('custom_html', 'custom_css', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ['label', 'global_template', 'url', 'order', 'parent', 'is_visible']
    list_filter = ['global_template', 'is_external', 'is_visible']
    search_fields = ['label', 'url']
    ordering = ['global_template', 'order']

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'layout', 'is_published', 'updated_at']
    list_filter = ['is_published', 'layout']
    search_fields = ['title', 'content', 'meta_title', 'meta_description']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'content', 'layout', 'is_published')
        }),
        ('SEO Settings', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'meta_image'),
            'classes': ('collapse',)
        }),
        ('Advanced SEO', {
            'fields': ('canonical_url', 'robots_meta', 'og_type', 'twitter_card', 'structured_data'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

@admin.register(DesignTemplate)
class DesignTemplateAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'name', 'is_active', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['name', 'display_name', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'active_template', 'updated_at']
    readonly_fields = ['updated_at']

@admin.register(PageLayout)
class PageLayoutAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'layout_type', 'is_active', 'updated_at']
    list_filter = ['layout_type', 'is_active']
    search_fields = ['name', 'display_name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [SectionInline]

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'page_layout', 'section_type', 'order', 'is_visible']
    list_filter = ['section_type', 'is_visible', 'page_layout']
    search_fields = ['title', 'subtitle']
    ordering = ['page_layout', 'order']
    inlines = [ContentBlockInline]

@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ['title', 'section', 'block_type', 'order', 'is_visible']
    list_filter = ['block_type', 'is_visible']
    search_fields = ['title', 'content']
    ordering = ['section', 'order']