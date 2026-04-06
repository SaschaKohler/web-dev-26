# Layout-System Dokumentation

## Übersicht

Das Layout-System ermöglicht die Erstellung moderner, responsiver Seiten mit wiederverwendbaren Komponenten. Alle Layouts können über das Django Admin oder eine Frontend-Oberfläche verwaltet werden.

## Architektur

### Backend-Modelle

#### 1. **PageLayout**
Definiert das Gesamt-Layout einer Seite.

**Felder:**
- `name`: Eindeutiger technischer Name
- `display_name`: Anzeigename
- `layout_type`: Typ (landing, about, services, portfolio, contact, custom)
- `description`: Beschreibung
- `is_active`: Aktiv-Status

#### 2. **Section**
Eine Section ist ein Abschnitt innerhalb eines Layouts.

**Section-Typen:**
- `hero`: Hero-Section mit großem Titel und CTA
- `features`: Feature-Grid mit Icons
- `cards`: Card-Grid für Services/Produkte
- `timeline`: Timeline für Chronologie
- `gallery`: Bildergalerie
- `video`: Video-Einbettung
- `testimonials`: Kundenstimmen
- `cta`: Call-to-Action
- `text`: Freier Textbereich
- `team`: Team-Mitglieder
- `pricing`: Preistabelle
- `faq`: FAQ-Akkordeon
- `contact_form`: Kontaktformular

**Styling-Optionen:**
- `background_type`: none, color, gradient, image, pattern
- `background_color`: Hex-Farbcode
- `background_image`: URL zum Hintergrundbild
- `padding_top/bottom`: Abstand in Pixeln
- `is_full_width`: Volle Breite ohne Container

#### 3. **ContentBlock**
Einzelne Inhalts-Elemente innerhalb einer Section.

**Block-Typen:**
- `text`: Textblock
- `image`: Bild
- `video`: Video
- `card`: Karte mit Bild, Text und Link
- `timeline_item`: Timeline-Eintrag
- `testimonial`: Testimonial
- `team_member`: Team-Mitglied
- `feature`: Feature mit Icon
- `stat`: Statistik
- `button`: Button/CTA
- `icon`: Icon

## Frontend-Komponenten

### Wiederverwendbare Section-Komponenten

#### HeroSection
```tsx
<HeroSection
  title="Hauptüberschrift"
  subtitle="Untertitel"
  backgroundImage="url"
  ctaText="Button Text"
  ctaLink="/link"
  height="70vh"
/>
```

#### CardGrid
```tsx
<CardGrid
  title="Überschrift"
  subtitle="Untertitel"
  cards={[
    {
      id: 1,
      title: "Karte 1",
      content: "Beschreibung",
      imageUrl: "url",
      linkUrl: "/link",
      linkText: "Mehr"
    }
  ]}
  columns={{ xs: 1, sm: 2, md: 3 }}
/>
```

#### Timeline
```tsx
<Timeline
  title="Unsere Geschichte"
  items={[
    {
      id: 1,
      title: "Meilenstein",
      date: "2020",
      content: "Beschreibung"
    }
  ]}
/>
```

#### ImageGallery
```tsx
<ImageGallery
  title="Galerie"
  images={[
    {
      id: 1,
      url: "image.jpg",
      alt: "Beschreibung",
      title: "Bildtitel"
    }
  ]}
  columns={{ xs: 1, sm: 2, md: 3 }}
/>
```

#### VideoSection
```tsx
<VideoSection
  title="Video"
  videoUrl="https://youtube.com/..."
  aspectRatio="16/9"
/>
```

#### FeatureSection
```tsx
<FeatureSection
  title="Features"
  features={[
    {
      id: 1,
      title: "Feature",
      content: "Beschreibung",
      iconName: "CheckCircle",
      iconColor: "#1976d2"
    }
  ]}
/>
```

#### CTASection
```tsx
<CTASection
  title="Jetzt starten!"
  subtitle="Untertitel"
  primaryButtonText="Hauptbutton"
  primaryButtonLink="/link"
  secondaryButtonText="Sekundär"
  secondaryButtonLink="/link"
/>
```

#### TestimonialSection
```tsx
<TestimonialSection
  title="Kundenstimmen"
  testimonials={[
    {
      id: 1,
      content: "Zitat",
      name: "Name",
      role: "Position",
      imageUrl: "avatar.jpg"
    }
  ]}
/>
```

### PageRenderer
Der PageRenderer rendert automatisch ein komplettes Layout basierend auf den Daten:

```tsx
import PageRenderer from './components/PageRenderer';

<PageRenderer layout={layoutData} />
```

## Vordefinierte Layouts

### 1. Moderne Landing Page
- Hero mit Hintergrundbild
- Features-Section mit 3 Icons
- CTA-Section

### 2. Über Uns mit Timeline
- Hero
- Timeline mit 4 Meilensteinen
- Team-Section

### 3. Leistungen mit Cards
- Hero
- Card-Grid mit 3 Services
- CTA

### 4. Portfolio mit Galerie
- Hero
- Bildergalerie mit 6+ Bildern
- Testimonials

## Verwendung

### Backend-Setup

1. **Migrationen ausführen:**
```bash
cd backend
uv run python manage.py makemigrations
uv run python manage.py migrate
```

2. **Layouts populieren:**
```bash
uv run python populate_layouts.py
```

### Django Admin

Zugriff über: `http://localhost:8000/admin`

**Layout erstellen:**
1. Gehe zu "Page Layouts" → "Add Page Layout"
2. Fülle Name, Display Name und Layout Type aus
3. Füge Sections inline hinzu
4. Speichern

**Section bearbeiten:**
1. Öffne ein Layout
2. Klicke auf eine Section
3. Füge Content Blocks hinzu
4. Ordne mit `order` Feld

### Frontend-Integration

```tsx
import { layoutsApi } from './api/layouts';
import PageRenderer from './components/PageRenderer';

function MyPage() {
  const [layout, setLayout] = useState(null);
  
  useEffect(() => {
    layoutsApi.getLayoutWithSections(1).then(setLayout);
  }, []);
  
  if (!layout) return <Loading />;
  
  return <PageRenderer layout={layout} />;
}
```

## API-Endpoints

- `GET /api/layouts/` - Alle Layouts
- `GET /api/layouts/{id}/` - Einzelnes Layout
- `GET /api/layouts/{id}/with_sections/` - Layout mit Sections
- `POST /api/layouts/` - Layout erstellen
- `PATCH /api/layouts/{id}/` - Layout aktualisieren
- `DELETE /api/layouts/{id}/` - Layout löschen

- `GET /api/sections/?layout_id={id}` - Sections eines Layouts
- `POST /api/sections/` - Section erstellen
- `PATCH /api/sections/{id}/` - Section aktualisieren
- `DELETE /api/sections/{id}/` - Section löschen

- `GET /api/blocks/?section_id={id}` - Blocks einer Section
- `POST /api/blocks/` - Block erstellen
- `PATCH /api/blocks/{id}/` - Block aktualisieren
- `DELETE /api/blocks/{id}/` - Block löschen

## Responsive Design

Alle Komponenten sind vollständig responsive:

- **xs** (mobile): < 600px
- **sm** (tablet): 600px - 960px
- **md** (desktop): 960px - 1280px
- **lg** (large): > 1280px

Grid-Spalten können pro Breakpoint definiert werden:
```tsx
columns={{ xs: 1, sm: 2, md: 3 }}
```

## Bild- und Video-Platzhalter

### Bilder
- Unsplash: `https://images.unsplash.com/photo-{id}?w={width}`
- Placeholder: `https://via.placeholder.com/{width}x{height}`

### Videos
- YouTube: `https://www.youtube.com/watch?v={id}`
- Vimeo: `https://vimeo.com/{id}`
- Direkt: URL zur MP4-Datei

## Best Practices

1. **Reihenfolge**: Nutze das `order` Feld für logische Anordnung
2. **Sichtbarkeit**: Nutze `is_visible` für A/B-Tests
3. **Padding**: Standard ist 80px (10 spacing units)
4. **Bilder**: Optimiere Bilder vor Upload (WebP, max 1920px)
5. **Videos**: Nutze YouTube/Vimeo für bessere Performance
6. **Icons**: Verwende MUI Icon-Namen (z.B. "CheckCircle", "Favorite")
7. **Farben**: Nutze Hex-Codes (#RRGGBB)

## Erweiterung

### Neue Section-Typen hinzufügen

1. **Backend** (`models.py`):
```python
SECTION_TYPES = [
    # ...
    ('new_type', 'Neuer Typ'),
]
```

2. **Frontend-Komponente** erstellen:
```tsx
// components/sections/NewSection.tsx
const NewSection: React.FC<Props> = ({ ... }) => {
  return <Box>...</Box>;
};
```

3. **PageRenderer** erweitern:
```tsx
case 'new_type':
  return <NewSection key={section.id} {...props} />;
```

## Troubleshooting

**Bilder werden nicht angezeigt:**
- Prüfe CORS-Einstellungen
- Verwende HTTPS-URLs
- Prüfe Bildformat (JPG, PNG, WebP)

**Layout wird nicht geladen:**
- Prüfe API-Verbindung
- Checke Browser-Konsole
- Verifiziere Layout-ID

**Sections in falscher Reihenfolge:**
- Prüfe `order` Felder
- Stelle sicher, dass alle Sections unterschiedliche Order-Werte haben
