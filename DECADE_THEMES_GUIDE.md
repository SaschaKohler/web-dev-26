# Dekaden-Design System Guide

## Übersicht

Das Dekaden-Design System ermöglicht es Benutzern, zwischen verschiedenen Design-Stilen aus unterschiedlichen Dekaden (90er, 2000er, 2010er, 2020er) zu wählen. Jede Dekade bietet 3 einzigartige Design-Variationen, die den authentischen Look und Feel der jeweiligen Zeit widerspiegeln.

## Architektur

### Frontend-Komponenten

#### 1. Theme-Definitionen (`frontend/src/themes/decadeThemes.ts`)

Enthält alle 12 vorkonfigurierten Dekaden-Themes (4 Dekaden × 3 Variationen):

**90er Jahre:**
- **Neon Cyber**: Neon-Farben, geometrische Muster, pixelige Ästhetik
- **Grunge Web**: Texturierte Hintergründe, gedämpfte Farben, Alternative-Ästhetik
- **Geocities Classic**: Klassisches Web-Design mit getilten Hintergründen

**2000er Jahre:**
- **Web 2.0 Gloss**: Glänzende Buttons, Verläufe, Reflexionen
- **MySpace Vibes**: Anpassbare Profile, kräftige Farben, soziale Energie
- **Vista Aero**: Durchscheinende Glas-Effekte, weiche Schatten

**2010er Jahre:**
- **Flat Design**: Minimalistisch, flache Farben, keine Schatten
- **Material Design**: Google Material Design mit Elevation
- **iOS Inspired**: Apple-inspiriertes Design mit subtilen Verläufen

**2020er Jahre:**
- **Neumorphism**: Soft UI mit subtilen Schatten und Highlights
- **Dark Mode Minimal**: Moderner Dark Mode mit lebendigen Akzenten
- **Glassmorphism**: Frosted-Glass-Effekt mit lebendigen Hintergründen

#### 2. Theme-Selector Komponente (`frontend/src/components/DecadeThemeSelector.tsx`)

Interaktive UI-Komponente zur Auswahl von Dekaden-Themes:
- Dropdown zur Dekaden-Auswahl
- Grid-Ansicht mit Theme-Karten
- Live-Vorschau-Dialog
- Farbpaletten-Anzeige
- Anwendungs-Buttons

#### 3. Theme Context (`frontend/src/contexts/ThemeContext.tsx`)

Erweitert um Dekaden-Theme-Unterstützung:
- `currentDecadeTheme`: Aktuell aktives Dekaden-Theme
- `setDecadeTheme(themeId)`: Methode zum Setzen eines Dekaden-Themes
- Automatisches Laden des gespeicherten Themes beim Start
- Custom CSS-Injection für spezielle Theme-Effekte

#### 4. Admin-Seite (`frontend/src/pages/admin/DecadeThemeManager.tsx`)

Verwaltungsseite für Administratoren:
- Übersicht über alle verfügbaren Themes
- Theme-Vorschau und -Anwendung
- Erfolgs-/Fehler-Benachrichtigungen
- Automatisches Neuladen nach Theme-Änderung

### Backend-Integration

#### 1. Datenbank-Modell

**SiteSettings Model** (`backend/cms_pages/models.py`):
```python
decade_theme_id = models.CharField(
    max_length=50, 
    blank=True, 
    null=True, 
    help_text='ID of the selected decade theme (e.g., 90s-1, 2020s-3)'
)
```

#### 2. API-Endpunkte

**Bestehende Endpunkte werden genutzt:**
- `GET /api/settings/current/` - Lädt aktuelle Einstellungen inkl. `decade_theme_id`
- `PATCH /api/settings/update_current/` - Aktualisiert `decade_theme_id`

**Frontend API-Methode** (`frontend/src/api/templates.ts`):
```typescript
setDecadeTheme: async (themeId: string): Promise<SiteSettings>
```

## Verwendung

### Für Administratoren

1. **Navigieren Sie zur Dekaden-Theme-Verwaltung:**
   - Öffnen Sie `/admin/decade-themes` im Browser

2. **Wählen Sie eine Dekade:**
   - Verwenden Sie das Dropdown-Menü, um zwischen 90er, 2000er, 2010er und 2020er zu wechseln

3. **Vorschau eines Themes:**
   - Klicken Sie auf "Vorschau" bei einem Theme
   - Sehen Sie sich Farben, Schriftarten und Komponenten an
   - Schließen Sie die Vorschau oder wenden Sie das Theme direkt an

4. **Theme anwenden:**
   - Klicken Sie auf "Anwenden" beim gewünschten Theme
   - Die Seite lädt automatisch neu, um alle Änderungen anzuzeigen

### Für Entwickler

#### Neues Theme hinzufügen

1. Öffnen Sie `frontend/src/themes/decadeThemes.ts`
2. Fügen Sie ein neues Theme-Objekt zum `decadeThemes` Array hinzu:

```typescript
{
  id: '2030s-1',
  decade: '2030s',
  variation: 1,
  name: 'Future Theme',
  description: 'Futuristic design',
  primaryColor: '#00FF00',
  secondaryColor: '#FF00FF',
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  fontFamily: 'Roboto, sans-serif',
  headingFont: 'Orbitron, sans-serif',
  borderRadius: 16,
  spacingUnit: 8,
  cardShadow: '0 4px 20px rgba(0,255,0,0.3)',
  buttonStyle: 'soft-rounded',
  accentColor: '#00FFFF',
  customCSS: `
    body {
      background: linear-gradient(45deg, #000 0%, #001a00 100%);
    }
  `
}
```

3. Aktualisieren Sie den `DecadeType` Type, falls eine neue Dekade hinzugefügt wird

#### Theme-Eigenschaften

Jedes Theme enthält folgende Eigenschaften:

| Eigenschaft | Typ | Beschreibung |
|------------|-----|--------------|
| `id` | string | Eindeutige ID (z.B. "90s-1") |
| `decade` | DecadeType | Dekade (90s, 2000s, 2010s, 2020s) |
| `variation` | 1\|2\|3 | Variations-Nummer |
| `name` | string | Anzeigename |
| `description` | string | Beschreibung |
| `primaryColor` | string | Primärfarbe (Hex) |
| `secondaryColor` | string | Sekundärfarbe (Hex) |
| `backgroundColor` | string | Hintergrundfarbe (Hex) |
| `textColor` | string | Textfarbe (Hex) |
| `fontFamily` | string | Schriftart für Text |
| `headingFont` | string | Schriftart für Überschriften |
| `borderRadius` | number | Border-Radius in Pixeln |
| `spacingUnit` | number | Spacing-Einheit in Pixeln |
| `cardShadow` | string | CSS-Shadow für Cards |
| `buttonStyle` | string | Button-Stil (pill, squared, soft-rounded, rounded) |
| `accentColor` | string | Akzentfarbe (optional) |
| `customCSS` | string | Custom CSS (optional) |

#### Custom CSS

Themes können Custom CSS enthalten, das automatisch injiziert wird:

```typescript
customCSS: `
  body {
    background-image: url('pattern.png');
  }
  .card {
    backdrop-filter: blur(10px);
  }
`
```

Das Custom CSS wird in ein `<style>` Element mit der ID `decade-theme-custom-css` eingefügt.

## Theme-Priorität

Das System priorisiert Themes in folgender Reihenfolge:

1. **Dekaden-Theme** (wenn `decade_theme_id` gesetzt ist)
2. **Design-Template** (wenn `active_template` gesetzt ist)
3. **Standard MUI Theme** (Fallback)

Wenn ein Dekaden-Theme aktiv ist, wird das Design-Template ignoriert.

## Migration

Die Datenbank-Migration `0006_sitesettings_decade_theme_id.py` fügt das neue Feld hinzu:

```bash
# Migration anwenden (falls noch nicht geschehen)
cd backend
uv run python manage.py migrate cms_pages
```

## Routing

Die Admin-Seite ist unter folgender Route verfügbar:
- **URL:** `/admin/decade-themes`
- **Komponente:** `DecadeThemeManager`
- **Layout:** `AdminLayout`

## Technische Details

### Theme-Anwendung

1. User wählt Theme in der Admin-Oberfläche
2. Frontend ruft `setDecadeTheme(themeId)` auf
3. API-Request aktualisiert `SiteSettings.decade_theme_id`
4. Seite lädt neu
5. `ThemeContext` lädt `SiteSettings` beim Start
6. Wenn `decade_theme_id` vorhanden, wird Dekaden-Theme geladen
7. Theme wird in MUI Theme konvertiert
8. Custom CSS wird injiziert (falls vorhanden)

### State Management

```typescript
// ThemeContext State
const [currentTemplate, setCurrentTemplate] = useState<DesignTemplate | null>(null);
const [currentDecadeTheme, setCurrentDecadeTheme] = useState<DecadeTheme | null>(null);
const [theme, setTheme] = useState<Theme>(createTheme());
```

### MUI Theme Conversion

Dekaden-Themes werden in MUI Themes konvertiert:
- Farben → `theme.palette`
- Schriftarten → `theme.typography`
- Border Radius → `theme.shape.borderRadius`
- Spacing → `theme.spacing`
- Shadows → `theme.shadows`
- Button-Stile → `theme.components.MuiButton`
- Card-Stile → `theme.components.MuiCard`

## Best Practices

1. **Konsistenz:** Halten Sie sich an die Design-Prinzipien der jeweiligen Dekade
2. **Zugänglichkeit:** Achten Sie auf ausreichende Kontraste (WCAG 2.1 AA)
3. **Performance:** Vermeiden Sie übermäßig komplexe Custom CSS
4. **Testing:** Testen Sie Themes auf verschiedenen Bildschirmgrößen
5. **Dokumentation:** Dokumentieren Sie spezielle Theme-Features

## Troubleshooting

### Theme wird nicht angewendet

1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass die Migration ausgeführt wurde
3. Prüfen Sie, ob `decade_theme_id` in der Datenbank gesetzt ist
4. Laden Sie die Seite neu (Hard Reload: Cmd+Shift+R)

### Custom CSS funktioniert nicht

1. Überprüfen Sie die CSS-Syntax
2. Verwenden Sie spezifischere Selektoren
3. Prüfen Sie, ob das `<style>` Element im `<head>` vorhanden ist

### Theme-Vorschau zeigt falsche Farben

1. Stellen Sie sicher, dass alle Hex-Farben gültig sind (#RRGGBB)
2. Überprüfen Sie die Theme-Definition in `decadeThemes.ts`

## Zukünftige Erweiterungen

Mögliche Erweiterungen des Systems:

- [ ] Benutzerdefinierte Themes erstellen
- [ ] Theme-Import/Export
- [ ] Theme-Variationen anpassen
- [ ] Animationen pro Dekade
- [ ] Sound-Effekte (optional)
- [ ] Theme-Vorschau ohne Anwendung
- [ ] A/B-Testing verschiedener Themes
- [ ] Theme-Analytics

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie diese Dokumentation
2. Schauen Sie sich die Code-Kommentare an
3. Kontaktieren Sie das Entwicklungsteam
