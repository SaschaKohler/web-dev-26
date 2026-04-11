"""
Analytics Middleware - automatisches Tracking aller Page Views
DSGVO-konform: Keine Cookies, keine persönlichen Daten, anonymisiert
"""
from .analytics import AnalyticsTracker


class AnalyticsMiddleware:
    """
    Middleware die automatisch Page Views trackt
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        # Pfade die nicht getrackt werden sollen
        self.excluded_paths = [
            '/admin/', '/static/', '/media/', '/api/',
            '/favicon.ico', '/robots.txt', '/sitemap.xml',
        ]
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Nur HTML-Responses tracken (keine API-Calls, Assets, etc.)
        content_type = response.get('Content-Type', '')
        if 'text/html' not in content_type:
            return response
        
        # Excluded Pfade überspringen
        path = request.path
        if any(path.startswith(excluded) for excluded in self.excluded_paths):
            return response
        
        # Site aus Request holen (von TenantMiddleware)
        site = getattr(request, 'site', None)
        if not site:
            return response
        
        # Bot-Detection (einfach)
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        bots = ['bot', 'crawler', 'spider', 'googlebot', 'bingbot', 'chrome-lighthouse']
        if any(bot in user_agent for bot in bots):
            return response
        
        # Tracken (non-blocking, Fehler sollten Request nicht blockieren)
        try:
            AnalyticsTracker.track_page_view(
                site=site,
                request=request,
                page_path=path
            )
        except Exception:
            # Silently fail - Analytics dürfen keine Requests blockieren
            pass
        
        return response
