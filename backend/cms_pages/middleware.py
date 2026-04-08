"""
Multi-tenant middleware for LSB Website Builder
Extracts subdomain from request and sets request.site
"""
from django.http import Http404
from .models import Site


class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extract subdomain from host
        host = request.get_host()
        
        # Skip for localhost and main domain
        if host in ['localhost', '127.0.0.1', 'localhost:8000', 'localhost:3000']:
            request.site = None
            return self.get_response(request)
        
        # Handle main domain (lsbwebsites.at / www.lsbwebsites.at)
        if host in ['lsbwebsites.at', 'www.lsbwebsites.at', 'api.lsbwebsites.at']:
            request.site = None
            return self.get_response(request)
        
        # Skip Railway and Netlify infrastructure domains
        if host.endswith('.up.railway.app') or host.endswith('.netlify.app'):
            request.site = None
            return self.get_response(request)
        
        # Extract subdomain
        if '.' in host:
            subdomain = host.split('.')[0]
            
            # Skip www and api subdomains
            if subdomain in ['www', 'api', 'admin']:
                request.site = None
                return self.get_response(request)
            
            try:
                request.site = Site.objects.get(subdomain=subdomain, is_active=True)
            except Site.DoesNotExist:
                request.site = None
                # For API requests, return 404
                if request.path.startswith('/api/'):
                    raise Http404(f"Site '{subdomain}' not found")
        else:
            request.site = None
        
        return self.get_response(request)
