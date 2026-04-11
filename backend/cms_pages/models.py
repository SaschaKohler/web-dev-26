from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User


class Site(models.Model):
    """Multi-tenant site container - each LSB gets their own site"""
    PLAN_CHOICES = [
        ('starter', 'Starter'),
        ('pro', 'Pro'),
        ('premium', 'Premium'),
    ]
    
    subdomain = models.CharField(max_length=63, unique=True, help_text='Unique subdomain (e.g., max-mustermann)')
    domain = models.CharField(max_length=255, blank=True, null=True, help_text='Custom domain if connected')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sites')
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='starter')
    
    # LSB-specific settings
    site_name = models.CharField(max_length=200, default='Lebens- und Sozialberatung')
    site_tagline = models.CharField(max_length=300, blank=True)
    cal_link = models.CharField(max_length=100, blank=True, help_text='Cal.com booking link')
    
    # Status
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.site_name} ({self.subdomain})"
    
    def get_full_domain(self):
        if self.domain:
            return self.domain
        return f"{self.subdomain}.lsbwebsites.at"


class DesignTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField()
    preview_image = models.URLField(blank=True, null=True)
    
    primary_color = models.CharField(max_length=7, default='#1976d2', validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    secondary_color = models.CharField(max_length=7, default='#dc004e', validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    accent_color = models.CharField(max_length=7, default='#f50057', validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    background_color = models.CharField(max_length=7, default='#ffffff', validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    text_color = models.CharField(max_length=7, default='#333333', validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    
    font_family = models.CharField(max_length=100, default='Roboto, sans-serif')
    heading_font = models.CharField(max_length=100, default='Poppins, sans-serif')
    
    border_radius = models.IntegerField(default=8)
    spacing_unit = models.IntegerField(default=8)
    
    header_style = models.CharField(max_length=50, default='modern')
    footer_style = models.CharField(max_length=50, default='minimal')
    button_style = models.CharField(max_length=50, default='rounded')
    
    card_shadow = models.CharField(max_length=100, default='0 2px 8px rgba(0,0,0,0.1)')
    
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_name']
    
    def __str__(self):
        return self.display_name
    
    def save(self, *args, **kwargs):
        if self.is_active:
            DesignTemplate.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


class SiteSettings(models.Model):
    site = models.OneToOneField(Site, on_delete=models.CASCADE, related_name='settings', null=True, blank=True)
    site_name = models.CharField(max_length=200, default='Lebens- und Sozialberatung')
    site_tagline = models.CharField(max_length=300, blank=True)
    logo_url = models.URLField(blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    active_template = models.ForeignKey(DesignTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='active_for_site')
    decade_theme_id = models.CharField(max_length=50, blank=True, null=True, help_text='ID of the selected decade theme (e.g., 90s-1, 2020s-3)')
    
    custom_css = models.TextField(blank=True)
    custom_js = models.TextField(blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return f"Site Settings - {self.site_name}"
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class PageLayout(models.Model):
    LAYOUT_CHOICES = [
        ('landing', 'Landing Page'),
        ('about', 'About Page'),
        ('services', 'Services Page'),
        ('portfolio', 'Portfolio Page'),
        ('contact', 'Contact Page'),
        ('custom', 'Custom Layout'),
    ]
    
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='layouts', null=True, blank=True)
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    layout_type = models.CharField(max_length=50, choices=LAYOUT_CHOICES, default='custom')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_name']
    
    def __str__(self):
        return self.display_name


class Section(models.Model):
    SECTION_TYPES = [
        ('hero', 'Hero Section'),
        ('features', 'Features Section'),
        ('cards', 'Card Grid'),
        ('timeline', 'Timeline'),
        ('gallery', 'Image Gallery'),
        ('video', 'Video Section'),
        ('testimonials', 'Testimonials'),
        ('cta', 'Call to Action'),
        ('text', 'Text Content'),
        ('team', 'Team Members'),
        ('pricing', 'Pricing Table'),
        ('faq', 'FAQ Accordion'),
        ('contact_form', 'Contact Form'),
        ('stats', 'Stats/Numbers'),
        ('logo_grid', 'Logo Grid'),
        ('process_steps', 'Process Steps'),
        ('newsletter', 'Newsletter Signup'),
    ]
    
    BACKGROUND_TYPES = [
        ('none', 'None'),
        ('color', 'Solid Color'),
        ('gradient', 'Gradient'),
        ('image', 'Image'),
        ('pattern', 'Pattern'),
    ]
    
    page_layout = models.ForeignKey(PageLayout, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    order = models.IntegerField(default=0)
    
    background_type = models.CharField(max_length=50, choices=BACKGROUND_TYPES, default='none')
    background_color = models.CharField(max_length=7, blank=True)
    background_image = models.URLField(blank=True, null=True)
    
    padding_top = models.IntegerField(default=80)
    padding_bottom = models.IntegerField(default=80)
    
    is_full_width = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    
    custom_css_class = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['page_layout', 'order']
    
    def __str__(self):
        return f"{self.page_layout.display_name} - {self.get_section_type_display()} ({self.order})"


class ContentBlock(models.Model):
    BLOCK_TYPES = [
        ('text', 'Text Block'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('card', 'Card'),
        ('timeline_item', 'Timeline Item'),
        ('testimonial', 'Testimonial'),
        ('team_member', 'Team Member'),
        ('feature', 'Feature'),
        ('stat', 'Statistic'),
        ('button', 'Button'),
        ('icon', 'Icon'),
    ]
    
    LINK_TYPES = [
        ('external', 'External URL'),
        ('internal', 'Internal Page'),
        ('none', 'No Link'),
    ]
    
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='content_blocks')
    block_type = models.CharField(max_length=50, choices=BLOCK_TYPES)
    order = models.IntegerField(default=0)
    
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    content = models.TextField(blank=True)
    
    image_url = models.URLField(blank=True, null=True)
    image_alt = models.CharField(max_length=200, blank=True)
    video_url = models.URLField(blank=True, null=True)
    
    link_type = models.CharField(max_length=20, choices=LINK_TYPES, default='none')
    link_url = models.URLField(blank=True, null=True)
    internal_page = models.ForeignKey('Page', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_blocks')
    link_text = models.CharField(max_length=100, blank=True)
    link_target = models.CharField(max_length=20, default='_self')
    
    icon_name = models.CharField(max_length=50, blank=True)
    icon_color = models.CharField(max_length=7, blank=True)
    
    metadata = models.JSONField(default=dict, blank=True)
    
    is_visible = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['section', 'order']
    
    def __str__(self):
        return f"{self.section.title} - {self.get_block_type_display()} ({self.order})"
    
    def get_link_url(self):
        if self.link_type == 'internal' and self.internal_page:
            return f"/{self.internal_page.slug}"
        elif self.link_type == 'external' and self.link_url:
            return self.link_url
        return None


class GlobalTemplate(models.Model):
    TEMPLATE_TYPES = [
        ('header', 'Header'),
        ('navigation', 'Navigation'),
        ('footer', 'Footer'),
    ]
    
    NAV_STYLES = [
        ('horizontal', 'Horizontal'),
        ('vertical', 'Vertical'),
        ('mega', 'Mega Menu'),
    ]
    
    HEADER_STYLES = [
        ('modern', 'Modern'),
        ('classic', 'Classic'),
        ('minimal', 'Minimal'),
        ('transparent', 'Transparent'),
    ]
    
    FOOTER_STYLES = [
        ('minimal', 'Minimal'),
        ('standard', 'Standard'),
        ('extended', 'Extended'),
    ]
    
    FOOTER_LAYOUTS = [
        ('single_column', 'Single Column'),
        ('two_columns', 'Two Columns'),
        ('three_columns', 'Three Columns'),
        ('four_columns', 'Four Columns'),
    ]
    
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='global_templates', null=True, blank=True)
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    
    # Logo & Branding
    logo_url = models.URLField(blank=True, null=True)
    logo_alt = models.CharField(max_length=200, blank=True)
    
    # Styling
    style = models.CharField(max_length=50, blank=True)
    background_color = models.CharField(max_length=7, blank=True)
    text_color = models.CharField(max_length=7, blank=True)
    accent_color = models.CharField(max_length=7, blank=True, help_text='Accent color for links and highlights')
    
    # Display Options
    show_social_links = models.BooleanField(default=True)
    show_contact_info = models.BooleanField(default=True)
    
    # Navigation-specific settings
    nav_position = models.CharField(max_length=20, blank=True, choices=[
        ('top', 'Top'),
        ('side', 'Side'),
        ('bottom', 'Bottom'),
    ], help_text='Navigation position (for navigation templates)')
    nav_sticky = models.BooleanField(default=False, help_text='Sticky navigation on scroll')
    nav_dropdown_enabled = models.BooleanField(default=True, help_text='Enable dropdown menus')
    nav_search_enabled = models.BooleanField(default=False, help_text='Show search bar in navigation')
    nav_cta_text = models.CharField(max_length=100, blank=True, help_text='Call-to-action button text')
    nav_cta_url = models.CharField(max_length=500, blank=True, help_text='Call-to-action button URL')
    
    # Footer-specific settings
    footer_layout = models.CharField(max_length=50, blank=True, choices=FOOTER_LAYOUTS, help_text='Footer column layout')
    footer_show_logo = models.BooleanField(default=True, help_text='Show logo in footer')
    footer_show_newsletter = models.BooleanField(default=False, help_text='Show newsletter signup')
    footer_newsletter_text = models.CharField(max_length=200, blank=True, help_text='Newsletter signup text')
    footer_copyright_text = models.CharField(max_length=200, blank=True, help_text='Copyright text')
    footer_show_back_to_top = models.BooleanField(default=True, help_text='Show back to top button')
    
    # Layout Template Reference (for Footer)
    footer_content_layout = models.ForeignKey(
        'PageLayout', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='footer_templates',
        help_text='Optional: Use a PageLayout for footer content sections'
    )
    
    # Custom Code
    custom_html = models.TextField(blank=True)
    custom_css = models.TextField(blank=True)
    
    metadata = models.JSONField(default=dict, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['template_type', 'display_name']
    
    def __str__(self):
        return f"{self.get_template_type_display()} - {self.display_name}"


class NavigationItem(models.Model):
    global_template = models.ForeignKey(GlobalTemplate, on_delete=models.CASCADE, related_name='nav_items')
    label = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    order = models.IntegerField(default=0)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    icon_name = models.CharField(max_length=50, blank=True)
    is_external = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['global_template', 'order']
    
    def __str__(self):
        return f"{self.label} ({self.global_template.display_name})"


class DecadeTheme(models.Model):
    DECADE_CHOICES = [
        ('90s', '1990s'),
        ('2000s', '2000s'),
        ('2010s', '2010s'),
        ('2020s', '2020s'),
    ]
    
    BUTTON_STYLE_CHOICES = [
        ('pill', 'Pill'),
        ('squared', 'Squared'),
        ('soft-rounded', 'Soft Rounded'),
        ('rounded', 'Rounded'),
    ]
    
    # Identification
    theme_id = models.CharField(max_length=50, unique=True, help_text='Unique theme ID (e.g., 90s-1, 2000s-2)')
    name = models.CharField(max_length=100)
    description = models.TextField()
    decade = models.CharField(max_length=10, choices=DECADE_CHOICES)
    variation = models.IntegerField(help_text='Theme variation number (1-3)')
    
    # Colors
    primary_color = models.CharField(max_length=7, validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    secondary_color = models.CharField(max_length=7, validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    background_color = models.CharField(max_length=7, validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    text_color = models.CharField(max_length=7, validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    accent_color = models.CharField(max_length=7, blank=True, validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')])
    
    # Typography
    font_family = models.CharField(max_length=200)
    heading_font = models.CharField(max_length=200)
    
    # Layout
    border_radius = models.IntegerField(default=8)
    spacing_unit = models.IntegerField(default=8)
    card_shadow = models.CharField(max_length=200)
    button_style = models.CharField(max_length=20, choices=BUTTON_STYLE_CHOICES, default='rounded')
    
    # Custom styling
    custom_css = models.TextField(blank=True, help_text='Custom CSS for special effects')
    
    # Metadata
    is_predefined = models.BooleanField(default=True, help_text='True for original 12 themes, False for user customizations')
    is_active = models.BooleanField(default=False, help_text='Currently active theme')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['decade', 'variation']
        verbose_name = 'Decade Theme'
        verbose_name_plural = 'Decade Themes'
    
    def __str__(self):
        return f"{self.name} ({self.decade})"
    
    def save(self, *args, **kwargs):
        if self.is_active:
            DecadeTheme.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


class Page(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='pages', null=True, blank=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField()
    content = models.TextField()
    layout = models.ForeignKey(PageLayout, on_delete=models.SET_NULL, null=True, blank=True, related_name='pages')
    
    meta_title = models.CharField(max_length=200, blank=True, help_text='SEO title (leave blank to use page title)')
    meta_description = models.CharField(max_length=320, blank=True, help_text='SEO description (max 320 characters)')
    meta_keywords = models.CharField(max_length=500, blank=True, help_text='Comma-separated keywords')
    meta_image = models.URLField(blank=True, null=True, help_text='Open Graph image URL')
    
    canonical_url = models.URLField(blank=True, null=True, help_text='Canonical URL for SEO')
    robots_meta = models.CharField(max_length=100, default='index, follow', help_text='Robots meta tag')
    
    og_type = models.CharField(max_length=50, default='website', help_text='Open Graph type')
    twitter_card = models.CharField(max_length=50, default='summary_large_image', help_text='Twitter card type')
    
    structured_data = models.JSONField(default=dict, blank=True, help_text='JSON-LD structured data')
    
    is_published = models.BooleanField(default=True)
    is_trashed = models.BooleanField(default=False, help_text='Moved to trash, pending deletion')
    trashed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def get_meta_title(self):
        return self.meta_title or self.title
    
    def get_meta_description(self):
        return self.meta_description or self.content[:160]


# ============================================================================
# ANALYTICS MODELS - Privacy-first, DSGVO-konform
# ============================================================================

class PageView(models.Model):
    """
    Anonymisierte Page Views - keine persönlichen Daten
    DSGVO-konform ohne Consent-Banner nötig
    """
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='page_views')
    page_path = models.CharField(max_length=255, default='/')
    
    # Anonymisierte technische Daten
    country = models.CharField(max_length=2, blank=True, help_text='ISO Ländercode')
    device_type = models.CharField(max_length=20, blank=True, choices=[
        ('desktop', 'Desktop'),
        ('mobile', 'Mobile'),
        ('tablet', 'Tablet'),
    ])
    browser_family = models.CharField(max_length=50, blank=True)
    os_family = models.CharField(max_length=50, blank=True)
    
    # Referrer Domain (ohne Query-Parameter)
    referrer_domain = models.CharField(max_length=255, blank=True)
    
    # Zeitstempel für Aggregierung
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    hour = models.IntegerField()
    date = models.DateField(db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['site', 'date', '-timestamp']),
            models.Index(fields=['site', 'page_path', 'date']),
        ]
        ordering = ['-timestamp']
        verbose_name = 'Page View'
        verbose_name_plural = 'Page Views'


class DailyStats(models.Model):
    """
    Aggregierte Tagesstatistiken für schnelle Dashboard-Abfragen
    """
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='daily_stats')
    date = models.DateField()
    
    # Kern-Metriken
    total_views = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    
    # Engagement (optional, falls implementiert)
    avg_session_duration = models.PositiveIntegerField(default=0, help_text='Sekunden')
    bounce_rate = models.FloatField(default=0.0)
    
    # Top-Daten als JSON (Top 10)
    top_pages = models.JSONField(default=list, help_text='Top 10 Seiten mit Views')
    referrers = models.JSONField(default=dict, help_text='Traffic-Quellen')
    devices = models.JSONField(default=dict, help_text='Device-Aufteilung')
    countries = models.JSONField(default=dict, help_text='Länder-Verteilung')
    
    # Zeitstempel
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['site', 'date']
        indexes = [
            models.Index(fields=['site', '-date']),
        ]
        ordering = ['-date']
        verbose_name = 'Tagesstatistik'
        verbose_name_plural = 'Tagesstatistiken'