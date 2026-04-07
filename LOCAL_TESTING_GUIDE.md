# LSB Website Builder - Lokales Multi-Tenant Testing

## Voraussetzungen

- Backend läuft auf http://localhost:8000
- Frontend läuft auf http://localhost:3000
- Python/Django Umgebung eingerichtet
- Node.js/npm für Frontend

---

## Schritt 1: Backend starten

```bash
cd /Users/saschakohler/Documents/01_Development/Active_Projects/web-dev-26/backend
uv run python manage.py runserver 0.0.0.0:8000
```

**Wichtig**: `0.0.0.0` erlaubt Zugriff von anderen Geräten im Netzwerk

---

## Schritt 2: Frontend starten

```bash
cd /Users/saschakohler/Documents/01_Development/Active_Projects/web-dev-26/frontend
npm start
```

Frontend läuft dann auf http://localhost:3000

---

## Schritt 3: Multi-Tenant Test-Strategie

Da wir lokal keine echten Subdomains haben (wie `kunde.lsbwebsites.at`), 
haben wir 3 Test-Optionen:

### Option A: Hosts-File Methode (Empfohlen)

Bearbeite `/etc/hosts` (macOS/Linux) oder `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1  localhost
127.0.0.1  test1.lsbwebsites.local
127.0.0.1  test2.lsbwebsites.local
127.0.0.1  max-mustermann.lsbwebsites.local
```

Dann teste via:
- http://test1.lsbwebsites.local:8000/api/pages/
- http://max-mustermann.lsbwebsites.local:8000/api/settings/current/

**Achtung**: Du musst nach hosts-Änderung den Browser neu starten!

---

### Option B: Query-Parameter Workaround (Schnell)

Da die Middleware auf `request.get_host()` prüft, können wir Subdomains 
über einen Custom Header simulieren.

Bearbeite `backend/cms_pages/middleware.py` temporär:

```python
# Füge dies am Anfang von __call__ hinzu:
# Für lokale Tests ohne hosts-File
if host.startswith('localhost') or host.startswith('127.0.0.1'):
    test_subdomain = request.META.get('HTTP_X_TEST_SUBDOMAIN')
    if test_subdomain:
        host = f"{test_subdomain}.lsbwebsites.at"
```

Dann teste mit Header:
```bash
curl -H "X-Test-Subdomain: max-mustermann" http://localhost:8000/api/pages/
```

---

### Option C: Django Shell (Automated Testing)

Für schnelle API-Tests ohne Browser:

```bash
cd backend
uv run python manage.py shell
```

```python
from cms_pages.services.onboarding import create_lsb_site
from cms_pages.models import Site, Page

# Test-Onboarding
result = create_lsb_site(
    email='test@example.com',
    site_name='Test Beratung',
    plan='pro'
)
print(f"Created site: {result['site']['domain']}")
print(f"Pages: {result['pages_created']}")

# Test Tenant Isolation
site = Site.objects.first()
print(f"Site subdomain: {site.subdomain}")
print(f"Site pages: {site.pages.count()}")
print(f"Site owner: {site.owner.email}")
```

---

## Schritt 4: API Endpoints Testen

### 4.1 Onboarding Test (Neue Site erstellen)

```bash
curl -X POST http://localhost:8000/api/onboard/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "max.mustermann@test.com",
    "site_name": "Max Mustermann Beratung",
    "plan": "pro",
    "first_name": "Max",
    "last_name": "Mustermann"
  }'
```

**Erwartete Response:**
```json
{
  "success": true,
  "site": {
    "subdomain": "max-mustermann-beratung",
    "domain": "max-mustermann-beratung.lsbwebsites.at",
    "admin_url": "..."
  },
  "credentials": {
    "username": "max",
    "password": "[SENT VIA EMAIL]"
  },
  "pages_created": 8,
  "plan": "pro"
}
```

---

### 4.2 Site-Isolierung Testen

Erstelle 2 Test-Sites:

```bash
# Site 1
curl -X POST http://localhost:8000/api/onboard/ \
  -H "Content-Type: application/json" \
  -d '{"email": "site1@test.com", "site_name": "Site One", "plan": "starter"}'

# Site 2  
curl -X POST http://localhost:8000/api/onboard/ \
  -H "Content-Type: application/json" \
  -d '{"email": "site2@test.com", "site_name": "Site Two", "plan": "starter"}'
```

Mit Hosts-File:
```bash
# Site 1 Pages (sollte nur Site 1 Pages zeigen)
curl http://site-one.lsbwebsites.local:8000/api/pages/

# Site 2 Pages (sollte nur Site 2 Pages zeigen)
curl http://site-two.lsbwebsites.local:8000/api/pages/
```

**Wichtig**: Die Sites sollten unterschiedliche Page-Inhalte haben!

---

### 4.3 Admin Dashboard Test

```bash
# Login (als Site-Owner)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "max", "password": "GENERATED_PASSWORD"}'

# Current User Info
curl http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Site Settings
curl http://site-one.lsbwebsites.local:8000/api/settings/current/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Schritt 5: Frontend Multi-Tenant Integration

### Subdomain im Frontend erkennen

Erstelle `frontend/src/utils/tenant.ts`:

```typescript
export function getSubdomain(): string | null {
  const host = window.location.host;
  
  // Local development
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // Use query param for local testing: ?subdomain=test-site
    const params = new URLSearchParams(window.location.search);
    return params.get('subdomain');
  }
  
  // Production: extract from subdomain
  if (host.includes('lsbwebsites.at')) {
    return host.split('.')[0];
  }
  
  return null;
}

export function getApiBaseUrl(): string {
  const subdomain = getSubdomain();
  
  if (subdomain && !window.location.host.includes('localhost')) {
    // Production: use subdomain
    return `https://${subdomain}.lsbwebsites.at/api`;
  }
  
  // Local development
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
}
```

---

## Schritt 6: Manuelle Tests durchführen

### Test 1: Onboarding Flow
1. POST /api/onboard/ mit neuen Daten
2. Prüfe Response: subdomain, credentials, pages_created
3. Login mit credentials
4. Prüfe ob SiteSettings existieren

### Test 2: Tenant Isolation
1. Erstelle 2 Sites
2. Bearbeite Page in Site 1
3. Prüfe dass Site 2 Page unverändert ist

### Test 3: API Permissions
1. User von Site 1 versucht auf Site 2 zuzugreifen
2. Sollte nur Site 1 Daten sehen (weil Token mit Site verknüpft)

---

## Schritt 7: Debugging

### Middleware Debug

Füge in `TenantMiddleware.__call__` hinzu:

```python
print(f"[TenantMiddleware] Host: {host}")
print(f"[TenantMiddleware] Subdomain: {subdomain}")
print(f"[TenantMiddleware] Site: {request.site}")
```

### Django Admin Test

1. Gehe zu http://localhost:8000/admin/
2. Login mit Superuser
3. Prüfe ob Site Model angezeigt wird
4. Erstelle manuell eine Site
5. Prüfe ob Pages angezeigt werden

---

## Schnell-Test Checklist

```bash
# 1. Backend starten
cd backend && uv run python manage.py runserver

# 2. Onboarding testen
curl -X POST http://localhost:8000/api/onboard/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "site_name": "Test", "plan": "starter"}'

# 3. Sites prüfen
cd backend && uv run python manage.py shell -c "from cms_pages.models import Site; print([s.subdomain for s in Site.objects.all()])"

# 4. Pages prüfen
cd backend && uv run python manage.py shell -c "from cms_pages.models import Page; print([f'{p.site.subdomain}: {p.title}' for p in Page.objects.select_related('site').all()])"
```

---

## Bekannte Einschränkungen beim lokalen Testen

| Problem | Lösung |
|---------|--------|
| Keine echten Subdomains | Hosts-File oder Header-Workaround |
| CORS Issues | `CORS_ALLOWED_ORIGINS` in settings.py erweitern |
| SSL/HTTPS | Lokal nicht nötig, in Production via Cloudflare |
| E-Mail Versand | Console Backend für Tests: `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` |

---

## Nächste Schritte

Nach erfolgreichem lokalem Test:

1. **Staging Deployment**: Railway.app Test-Instanz
2. **Echte Subdomains**: Cloudflare DNS + Wildcard SSL
3. **Stripe Test Mode**: Test-Zahlungen simulieren
4. **E-Mail Service**: SendGrid/Resend Integration

---

*Dokument erstellt: April 2026*
