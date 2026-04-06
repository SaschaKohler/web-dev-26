# Design Template System - Dokumentation

## Übersicht

Das Design Template System ermöglicht es Benutzern, aus 7 professionell gestalteten Templates für Lebens- und Sozialberatung auszuwählen und diese über eine Frontend-Admin-Oberfläche zu verwalten.

## Templates

### 1. **Ruhige Gelassenheit** (calm_serenity)
- **Farben**: Beruhigende Grüntöne (#6B9080, #A4C3B2, #CCE3DE)
- **Schriftarten**: Inter & Playfair Display
- **Stil**: Sanfte, abgerundete Formen (12px Radius)
- **Ideal für**: Entspannte, vertrauensvolle Atmosphäre

### 2. **Warme Umarmung** (warm_embrace)
- **Farben**: Warme Erdtöne (#D4A574, #E8C4A0, #F4E4D7)
- **Schriftarten**: Lato & Merriweather
- **Stil**: Gemütlich, einladend (8px Radius)
- **Ideal für**: Herzliche, warme Beratungsumgebung

### 3. **Professionelles Vertrauen** (professional_trust)
- **Farben**: Klare Blautöne (#2C5F7C, #4A90A4, #7FB3D5)
- **Schriftarten**: Open Sans & Montserrat
- **Stil**: Klar, strukturiert (6px Radius)
- **Ideal für**: Kompetenz und Vertrauenswürdigkeit

### 4. **Sanfte Natur** (gentle_nature)
- **Farben**: Natürliche Grüntöne (#7D9D7C, #A8C5A7, #C9E4C5)
- **Schriftarten**: Nunito & Lora
- **Stil**: Organisch, harmonisch (16px Radius)
- **Ideal für**: Erdende, naturnahe Atmosphäre

### 5. **Moderne Klarheit** (modern_clarity)
- **Farben**: Neutrale Grautöne (#5E6572, #8B95A5, #B8C5D6)
- **Schriftarten**: Roboto & Poppins
- **Stil**: Minimalistisch, modern (4px Radius)
- **Ideal für**: Zeitgemäße, klare Präsentation

### 6. **Sanfter Lavendel** (soft_lavender)
- **Farben**: Beruhigende Violetttöne (#9B8FB9, #C5B9D4, #E5DFF0)
- **Schriftarten**: Source Sans Pro & Crimson Text
- **Stil**: Elegant, raffiniert (10px Radius)
- **Ideal für**: Entspannende, meditative Stimmung

### 7. **Sonnenaufgang Optimismus** (sunrise_optimism)
- **Farben**: Lebendige Warme Töne (#E89F71, #F4C2A0, #FFE5D4)
- **Schriftarten**: Quicksand & Josefin Sans
- **Stil**: Hoffnungsvoll, positiv (14px Radius)
- **Ideal für**: Optimistische, aufbauende Ausstrahlung

## Backend-Komponenten

### Models (`backend/cms_pages/models.py`)

#### DesignTemplate
Speichert alle Design-Konfigurationen:
- Farbpalette (primary, secondary, accent, background, text)
- Typografie (font_family, heading_font)
- Styling (border_radius, spacing_unit, shadows)
- Status (is_active)

#### SiteSettings
Globale Website-Einstellungen:
- Site-Informationen (name, tagline, logo)
- Kontaktdaten (email, phone, address)
- Social Media Links
- Aktives Template-Referenz

### API Endpoints

- `GET /api/templates/` - Alle Templates abrufen
- `GET /api/templates/active/` - Aktives Template abrufen
- `POST /api/templates/{id}/activate/` - Template aktivieren
- `PATCH /api/templates/{id}/` - Template aktualisieren
- `GET /api/settings/current/` - Aktuelle Einstellungen abrufen
- `PATCH /api/settings/update_current/` - Einstellungen aktualisieren

## Frontend-Komponenten

### ThemeContext (`frontend/src/contexts/ThemeContext.tsx`)
- Lädt aktives Template beim Start
- Erstellt dynamisches MUI-Theme basierend auf Template
- Stellt `refreshTheme()` Funktion bereit

### AdminTemplates Page (`frontend/src/pages/AdminTemplates.tsx`)
Hauptverwaltungsseite mit zwei Tabs:

#### Tab 1: Design Templates
- Grid-Ansicht aller verfügbaren Templates
- Template-Karten mit Vorschau
- Aktivierungs-Funktion
- Detaillierte Vorschau-Dialog

#### Tab 2: Website Einstellungen
- Site-Name und Slogan
- Kontaktinformationen
- Social Media Links
- Speichern-Funktion

### TemplateCard (`frontend/src/components/TemplateCard.tsx`)
- Visuelle Darstellung des Templates
- Farbpaletten-Vorschau
- Aktivierungs-Button
- Vorschau-Button

## Setup & Installation

### 1. Datenbank-Migration ausführen

```bash
cd backend
uv run python manage.py makemigrations
uv run python manage.py migrate
```

### 2. Templates populieren

```bash
uv run python populate_templates.py
```

### 3. Frontend-Abhängigkeiten

Bereits installiert:
- @mui/material ^7.3.9
- @mui/icons-material ^7.3.9
- axios ^1.14.0

## Verwendung

### Für Administratoren

1. **Django Admin** (nur für kritische Wartung):
   - URL: `http://localhost:8000/admin`
   - Zugriff auf DesignTemplate und SiteSettings Models

2. **Frontend Admin** (für tägliche Verwaltung):
   - URL: `http://localhost:3000/admin/templates`
   - Template-Auswahl und -Aktivierung
   - Website-Einstellungen bearbeiten

### Template aktivieren

1. Navigiere zu `/admin/templates`
2. Wähle "Design Templates" Tab
3. Klicke auf "Vorschau" für Details
4. Klicke auf "Aktivieren" um Template zu aktivieren
5. Die Website aktualisiert sich automatisch mit neuem Design

### Website-Einstellungen bearbeiten

1. Navigiere zu `/admin/templates`
2. Wähle "Website Einstellungen" Tab
3. Bearbeite Felder nach Bedarf
4. Klicke "Einstellungen Speichern"

## Technische Details

### Theme-Anwendung

Das aktive Template wird automatisch in ein MUI-Theme konvertiert:
- Palette-Farben werden gemappt
- Typografie wird konfiguriert
- Border-Radius und Spacing werden angewendet
- Button- und Card-Styles werden angepasst

### Automatische Synchronisation

- Nur ein Template kann aktiv sein
- Bei Aktivierung werden andere Templates deaktiviert
- SiteSettings.active_template wird automatisch aktualisiert
- Frontend lädt aktives Template beim Start

## Erweiterung

### Neues Template hinzufügen

1. Bearbeite `backend/populate_templates.py`
2. Füge neues Template-Dictionary hinzu
3. Führe Script aus: `uv run python populate_templates.py`

### Template-Eigenschaften anpassen

Bearbeite `backend/cms_pages/models.py` um neue Felder hinzuzufügen:
- Neue Farben
- Zusätzliche Styling-Optionen
- Custom CSS/JS Felder

## Sicherheit

- Django Admin bleibt für kritische Operationen reserviert
- Frontend Admin benötigt keine speziellen Berechtigungen (kann später mit Authentication erweitert werden)
- Alle API-Endpoints sind über CORS geschützt

## Nächste Schritte

1. ✅ Templates erstellt und konfiguriert
2. ✅ Frontend Admin-Interface implementiert
3. ✅ Theme-Switching funktioniert
4. 🔄 Optional: Authentication für Frontend Admin hinzufügen
5. 🔄 Optional: Template-Editor für Farbanpassungen
6. 🔄 Optional: Logo-Upload-Funktion
