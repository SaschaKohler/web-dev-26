# Analytics Setup für LSB Websites

## Option 1: Django Native Analytics (Empfohlen für Start)

### Vorteile:
- Keine zusätzlichen Hosting-Kosten
- Vollständige Datenkontrolle
- Keine externe Abhängigkeit
- Automatisch DSGVO-konform
- Einfache Integration

### Setup:

```bash
# 1. Migration erstellen und ausführen
cd backend
python manage.py makemigrations cms_pages
python manage.py migrate

# 2. Middleware aktivieren (settings.py)
```

**settings.py ergänzen:**
```python
MIDDLEWARE = [
    'cms_pages.middleware.TenantMiddleware',
    'cms_pages.analytics_middleware.AnalyticsMiddleware',  # ← HINZUFÜGEN
    # ... restliche middleware
]
```

**Analytics funktioniert sofort!** Jeder Seitenaufruf wird automatisch anonymisiert getrackt.

### API Endpoints:

| Endpoint | Beschreibung |
|----------|--------------|
| `GET /api/analytics/overview/?days=30` | Übersichts-Stats |
| `GET /api/analytics/chart/?days=30` | Zeitreihen für Charts |
| `GET /api/analytics/pages/?days=30` | Top Seiten |
| `GET /api/analytics/sources/?days=30` | Traffic-Quellen |
| `GET /api/analytics/realtime/` | Echtzeit-Stats |

### Frontend Dashboard:

Einfaches React-Dashboard für Kunden:

```tsx
import { useEffect, useState } from 'react';

function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch('/api/analytics/overview/?days=30')
      .then(r => r.json())
      .then(data => setStats(data.data));
  }, []);
  
  return (
    <div>
      <h2>Besucher (30 Tage): {stats?.total_visitors}</h2>
      <h2>Page Views: {stats?.total_views}</h2>
    </div>
  );
}
```

---

## Option 2: Plausible Self-Hosted (Für Fortgeschrittene)

### Vorteile:
- Professionelle Analytics-Oberfläche
- Echtzeit-Daten
- Einfache Export-Funktionen
- Nur €5/Monat auf Railway

### Setup auf Railway:

1. **Neues Projekt auf Railway erstellen**
2. **Template auswählen**: "Plausible Analytics"
3. **Domain verbinden**: `analytics.lsbwebsites.at`
4. **Environment Variables:**
   ```
   BASE_URL=https://analytics.lsbwebsites.at
   SECRET_KEY_BASE=(random 64 chars)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

### Frontend Integration:

```html
<!-- In index.html oder Template -->
<script defer data-domain="{site.subdomain}.lsbwebsites.at" 
        src="https://analytics.lsbwebsites.at/js/script.js"></script>
```

---

## Datenschutz-Vergleich

| Feature | Django Native | Plausible | Google Analytics |
|---------|---------------|-----------|------------------|
| Cookies | ❌ Nein | ❌ Nein | ✅ Ja |
| IP-Speicherung | ❌ Nein | ❌ Nein | ✅ Ja |
| Consent-Banner nötig | ❌ Nein | ❌ Nein | ✅ Ja |
| DSGVO-konform | ✅ Ja | ✅ Ja | ⚠️ Komplex |
| Datenhoheit | ✅ Voll | ✅ Voll | ❌ Google |

---

## Empfehlung

**Für den Start:** Django Native Analytics verwenden
- Keine zusätzlichen Kosten
- Reicht für 99% der LSBs
- Einfach zu warten

**Bei hohen Anforderungen:** Plausible Self-Hosted
- Wenn Kunden detaillierte Reports wünschen
- Echtzeit-Daten wichtig
- Bei >100.000 Pageviews/Monat

---

## Kostenübersicht

| Lösung | Setup | Monatlich | bei 1000 Sites |
|--------|-------|-----------|----------------|
| Django Native | 0€ | 0€ | 0€ |
| Plausible Self-Hosted | 0€ | ~€5 | ~€20 |
| Matomo Self-Hosted | 0€ | ~€15 | ~€100+ |
| Plausible Cloud | 0€ | €9/Site | €9000 |
