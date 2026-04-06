# Global Page Templates & SEO Guide

## Übersicht

Dieses System bietet globale Page Templates für Header, Navigation und Footer sowie umfassende SEO-Funktionalität.

## Backend-Komponenten

### Modelle

#### GlobalTemplate
Definiert globale Seitenelemente (Header, Navigation, Footer).

**Felder:**
- `name`: Eindeutiger technischer Name
- `display_name`: Anzeigename
- `template_type`: Typ (header, navigation, footer)
- `logo_url`: URL zum Logo
- `style`: Stil-Variante
- `background_color`: Hintergrundfarbe
- `text_color`: Textfarbe
- `show_social_links`: Social Media Links anzeigen
- `show_contact_info`: Kontaktinformationen anzeigen
- `custom_html`: Benutzerdefiniertes HTML
- `custom_css`: Benutzerdefiniertes CSS
- `is_active`: Aktiv-Status

#### NavigationItem
Einzelne Navigationseinträge.

**Felder:**
- `label`: Anzeigetext
- `url`: Ziel-URL
- `order`: Reihenfolge
- `parent`: Übergeordnetes Element (für Dropdown-Menüs)
- `icon_name`: MUI Icon-Name
- `is_external`: Externer Link
- `is_visible`: Sichtbarkeit

#### Page (erweitert mit SEO)
**Neue SEO-Felder:**
- `meta_title`: SEO-Titel
- `meta_description`: SEO-Beschreibung (max 320 Zeichen)
- `meta_keywords`: Komma-getrennte Keywords
- `meta_image`: Open Graph Bild-URL
- `canonical_url`: Kanonische URL
- `robots_meta`: Robots Meta Tag (default: "index, follow")
- `og_type`: Open Graph Type (default: "website")
- `twitter_card`: Twitter Card Type
- `structured_data`: JSON-LD Structured Data

### API-Endpoints

**Global Templates:**
- `GET /api/global-templates/` - Alle Templates
- `GET /api/global-templates/{id}/` - Einzelnes Template
- `GET /api/global-templates/header/` - Aktives Header-Template
- `GET /api/global-templates/navigation/` - Aktive Navigation
- `GET /api/global-templates/footer/` - Aktives Footer-Template
- `POST /api/global-templates/` - Template erstellen
- `PATCH /api/global-templates/{id}/` - Template aktualisieren
- `DELETE /api/global-templates/{id}/` - Template löschen

**Navigation Items:**
- `GET /api/navigation-items/` - Alle Navigationseinträge
- `GET /api/navigation-items/?template_id={id}` - Items eines Templates
- `POST /api/navigation-items/` - Item erstellen
- `PATCH /api/navigation-items/{id}/` - Item aktualisieren
- `DELETE /api/navigation-items/{id}/` - Item löschen

**Site Settings:**
- `GET /api/settings/current/` - Aktuelle Einstellungen
- `PATCH /api/settings/update_current/` - Einstellungen aktualisieren

## Frontend-Komponenten

### Header
Responsive Header-Komponente mit Logo und Mobile-Menü.

**Styles:**
- `modern`: Moderner Look mit Schatten
- `classic`: Klassischer Look
- `minimal`: Minimalistisch mit Border
- `transparent`: Transparenter Header (für Hero-Sections)

**Props:**
```tsx
<Header
  logoUrl="https://example.com/logo.png"
  logoAlt="Logo"
  backgroundColor="#ffffff"
  textColor="#333333"
  style="modern"
  onMenuClick={() => {}}
/>
```

### Navigation
Responsive Navigation mit Dropdown-Support.

**Styles:**
- `horizontal`: Horizontale Navigation
- `vertical`: Vertikale Sidebar
- `mega`: Mega-Menü (geplant)

**Props:**
```tsx
<Navigation
  items={navigationItems}
  style="horizontal"
  backgroundColor="#f5f5f5"
  textColor="#333333"
  mobileOpen={false}
  onMobileClose={() => {}}
/>
```

### Footer
Responsive Footer mit Social Links und Kontaktinformationen.

**Styles:**
- `minimal`: Minimalistisch
- `standard`: Standard mit Kontaktinfo
- `extended`: Erweitert mit mehreren Spalten

**Props:**
```tsx
<Footer
  style="standard"
  backgroundColor="#2c3e50"
  textColor="#ffffff"
  showSocialLinks={true}
  showContactInfo={true}
  siteSettings={settings}
/>
```

### SEO Component
React Helmet-basierte SEO-Komponente.

**Props:**
```tsx
<SEO
  title="Seitentitel"
  description="Seitenbeschreibung"
  keywords="keyword1, keyword2"
  image="https://example.com/image.jpg"
  type="website"
  canonicalUrl="https://example.com/page"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Firmenname"
  }}
/>
```

### PageLayout
Wrapper-Komponente die Header, Navigation, Footer und SEO kombiniert.

**Verwendung:**
```tsx
import PageLayout from './components/layout/PageLayout';

function MyPage() {
  return (
    <PageLayout
      seoTitle="Meine Seite"
      seoDescription="Beschreibung meiner Seite"
      seoKeywords="keyword1, keyword2"
    >
      <YourPageContent />
    </PageLayout>
  );
}
```

## Installation & Setup

### Backend

1. **Migrationen erstellen und ausführen:**
```bash
cd backend
uv run python manage.py makemigrations cms_pages
uv run python manage.py migrate
```

2. **Sample-Daten laden:**
```bash
uv run python populate_global_templates.py
```

3. **Django Admin:**
Zugriff über `http://localhost:8000/admin`
- Erstelle/bearbeite Global Templates
- Füge Navigation Items hinzu
- Konfiguriere Site Settings

### Frontend

1. **Dependencies installieren:**
```bash
cd frontend
npm install react-helmet-async
```

2. **HelmetProvider in App einbinden:**
```tsx
// src/index.tsx
import { HelmetProvider } from 'react-helmet-async';

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

3. **PageLayout verwenden:**
```tsx
import PageLayout from './components/layout/PageLayout';

function App() {
  return (
    <PageLayout>
      <Routes>
        {/* Your routes */}
      </Routes>
    </PageLayout>
  );
}
```

## Konfiguration

### Header-Template erstellen

1. Django Admin → Global Templates → Add Global Template
2. Template Type: "Header"
3. Style: "modern", "classic", "minimal", oder "transparent"
4. Logo URL und Farben konfigurieren
5. "Is Active" aktivieren

### Navigation konfigurieren

1. Django Admin → Global Templates → Add Global Template
2. Template Type: "Navigation"
3. Style: "horizontal" oder "vertical"
4. Navigation Items inline hinzufügen:
   - Label: Anzeigetext
   - URL: Ziel-URL (z.B. "/about")
   - Order: Reihenfolge
   - Icon Name: MUI Icon (z.B. "Home", "Person")
   - Parent: Leer für Top-Level, oder Parent-ID für Dropdown

### Footer-Template erstellen

1. Django Admin → Global Templates → Add Global Template
2. Template Type: "Footer"
3. Style: "minimal", "standard", oder "extended"
4. Social Links und Contact Info Optionen aktivieren
5. Site Settings mit Kontaktdaten füllen

### SEO für Pages konfigurieren

1. Django Admin → Pages → Edit Page
2. SEO Settings Sektion:
   - Meta Title: SEO-optimierter Titel
   - Meta Description: 150-320 Zeichen
   - Meta Keywords: Komma-getrennt
   - Meta Image: Open Graph Bild-URL
3. Advanced SEO:
   - Canonical URL: Kanonische URL
   - Robots Meta: "index, follow" oder "noindex, nofollow"
   - Structured Data: JSON-LD Format

## Structured Data Beispiele

### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lebens- und Sozialberatung",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+43-123-456-789",
    "contactType": "customer service"
  }
}
```

### LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lebens- und Sozialberatung",
  "image": "https://example.com/image.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 1",
    "addressLocality": "Wien",
    "postalCode": "1010",
    "addressCountry": "AT"
  },
  "telephone": "+43-123-456-789"
}
```

### Person (für Berater)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Max Mustermann",
  "jobTitle": "Lebens- und Sozialberater",
  "telephone": "+43-123-456-789",
  "email": "max@example.com"
}
```

## Best Practices

### SEO
1. **Meta Title**: 50-60 Zeichen, Keywords am Anfang
2. **Meta Description**: 150-160 Zeichen, Call-to-Action einbauen
3. **Keywords**: 5-10 relevante Keywords
4. **Images**: Alt-Tags verwenden, optimierte Größe
5. **Structured Data**: Passenden Schema.org Type verwenden
6. **Canonical URLs**: Duplicate Content vermeiden

### Navigation
1. **Flat Hierarchy**: Max 2-3 Ebenen
2. **Clear Labels**: Beschreibende, kurze Labels
3. **Mobile First**: Touch-friendly Größen
4. **Icons**: Sparsam einsetzen, nur wenn hilfreich

### Performance
1. **Logo**: WebP Format, max 200KB
2. **Lazy Loading**: Für Bilder aktivieren
3. **Caching**: Browser-Caching für statische Assets
4. **CDN**: Für Bilder und Assets verwenden

## Troubleshooting

**Templates werden nicht geladen:**
- Prüfe `is_active` Status im Admin
- Checke Browser-Konsole für API-Fehler
- Verifiziere CORS-Einstellungen

**Navigation Items nicht sichtbar:**
- Prüfe `is_visible` Flag
- Checke `order` Werte
- Verifiziere Parent-Child Beziehungen

**SEO Meta Tags fehlen:**
- react-helmet-async installiert?
- HelmetProvider in index.tsx?
- SEO Component korrekt eingebunden?

## Erweiterung

### Neue Template-Typen hinzufügen

1. **Backend** (`models.py`):
```python
TEMPLATE_TYPES = [
    # ...
    ('sidebar', 'Sidebar'),
]
```

2. **Frontend-Komponente** erstellen
3. **PageLayout** erweitern
4. **Migration** erstellen und ausführen
