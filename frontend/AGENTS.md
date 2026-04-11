# Frontend Agent Guidelines

## Stack & Tooling

- **Framework:** React 19 + TypeScript
- **Routing:** React Router v7
- **UI:** MUI v7 (Material UI) + Emotion
- **HTTP:** Axios
- **Animation:** Framer Motion
- **Testing:** Vitest + Testing Library + MSW (Mock Service Worker)
- **Build:** react-scripts (CRA)

### NPM Commands

```bash
# Entwicklungsserver starten
npm start

# Production Build
npm run build

# Tests einmalig ausführen (Vitest)
npm run test:unit

# Tests im Watch-Modus
npm run test:unit:watch

# Test Coverage
npm run test:coverage
```

> Alle Befehle werden aus dem Verzeichnis `frontend/` ausgeführt.

---

## Projektstruktur

```
frontend/src/
├── api/                    # Axios-Funktionen pro Ressource
│   ├── config.ts           # Axios-Instanz & Basis-URL
│   ├── layouts.ts
│   ├── templates.ts
│   ├── globalTemplates.ts
│   └── decadeThemes.ts
├── components/             # Wiederverwendbare UI-Komponenten
│   ├── Login.tsx
│   ├── ProtectedRoute.tsx
│   ├── PageRenderer.tsx
│   ├── layout/             # Layout-spezifische Komponenten
│   └── sections/           # Section-Komponenten
├── contexts/               # React Context Provider
│   ├── AuthContext.tsx      # Auth-State & JWT-Logik
│   ├── ThemeContext.tsx     # Tenant-Theme
│   └── AdminThemeContext.tsx
├── pages/                  # Seitenkomponenten (Route-Level)
├── themes/                 # MUI Theme-Definitionen
└── test/                   # Test-Infrastruktur
    ├── setup.ts             # Vitest Setup (MSW Server)
    ├── test-utils.tsx       # customRender mit allen Providern
    ├── mocks/
    │   ├── handlers.ts      # MSW Request Handlers
    │   └── server.ts        # MSW Node Server
    └── components/          # Komponenten-Tests
```

---

## TypeScript Best Practices

- **Kein `any`** — immer explizite Typen oder `unknown` mit Type Guard.
- Props-Interfaces direkt über der Komponente definieren, nicht in separaten Dateien (außer bei Wiederverwendung).
- API-Response-Typen in der jeweiligen `api/*.ts`-Datei definieren und exportieren.
- `React.FC<Props>` für funktionale Komponenten verwenden.

```tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction, isLoading = false }) => {
  return <div>{title}</div>;
};
```

---

## Komponenten Best Practices

- **Single Responsibility:** Eine Komponente macht eine Sache.
- **Keine direkten API-Calls in Komponenten** — Logik in Contexts oder Custom Hooks auslagern.
- **Custom Hooks** für wiederverwendbare State-Logik (`useMyFeature.ts`).
- Komplexe Komponenten (>200 Zeilen) in Unterkomponenten aufteilen.
- MUI-Komponenten bevorzugen — keine eigenen primitiven UI-Elemente.

### API-Aufrufe

```tsx
// api/myResource.ts
import api from './config';

export interface MyResource {
  id: number;
  name: string;
}

export const getMyResource = async (id: number): Promise<MyResource> => {
  const response = await api.get<MyResource>(`/my-resource/${id}/`);
  return response.data;
};
```

---

## Routing

- Seitenkomponenten liegen in `src/pages/`.
- Geschützte Routen via `<ProtectedRoute>` wrappen.
- Navigation immer via `useNavigate()` — kein direktes `window.location`.

```tsx
<Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
```

---

## Auth

- Auth-State ausschließlich über `AuthContext` (`useAuth()`-Hook) konsumieren.
- JWT Access Token (15 min) + Refresh Token (7 Tage, rotierend).
- Token-Refresh läuft automatisch über den Axios-Interceptor in `api/config.ts`.
- Niemals Tokens in `localStorage` direkt lesen/schreiben — nur über `AuthContext`.

---

## Testing

### Grundregeln

- **Jede neue Komponente bekommt Tests** — Rendering, User Interactions, Edge Cases.
- Tests liegen in `src/test/components/<ComponentName>.test.tsx`.
- Immer `customRender` aus `src/test/test-utils.tsx` verwenden — nie das Standard `render` aus Testing Library direkt importieren.
- API-Calls werden via **MSW** gemockt — kein `vi.mock('axios')` oder `vi.mock('../api/...')`.
- Neue API-Endpunkte in `src/test/mocks/handlers.ts` ergänzen.

### Test-Struktur

```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';  // immer customRender!
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('rendert korrekt', () => {
    render(<MyComponent />);
    expect(screen.getByText('Erwarteter Text')).toBeInTheDocument();
  });

  it('reagiert auf User-Interaktion', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    await user.click(screen.getByRole('button', { name: /speichern/i }));
    await waitFor(() => {
      expect(screen.getByText('Gespeichert')).toBeInTheDocument();
    });
  });
});
```

### Was getestet werden muss

- **Rendering:** Pflicht-Elemente sichtbar, korrekter initialer State
- **User Interactions:** Klicks, Formulareingaben, Navigation
- **Async States:** Loading-Zustand, Error-Zustand, Success-Zustand
- **Auth-abhängiges Verhalten:** Komponenten die `useAuth()` nutzen
- **Conditional Rendering:** Verschiedene Props-Kombinationen

### MSW Handler ergänzen

Wenn ein neuer API-Endpunkt benötigt wird, Handler in `src/test/mocks/handlers.ts` hinzufügen:

```ts
import { http, HttpResponse } from 'msw';

// In handlers-Array ergänzen:
http.get(`${API_BASE}/my-resource/`, () => {
  return HttpResponse.json([{ id: 1, name: 'Test' }]);
}),

http.post(`${API_BASE}/my-resource/`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({ id: 2, ...body as object }, { status: 201 });
}),
```

### Navigation mocken

```tsx
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Im Test prüfen:
expect(mockNavigate).toHaveBeenCalledWith('/admin');
```

---

## Code-Qualität & ESLint

**Vor jedem Commit und Push müssen alle ESLint-Fehler behoben sein.**

```bash
# ESLint manuell ausführen
npx eslint src --ext .ts,.tsx

# Mit Auto-Fix
npx eslint src --ext .ts,.tsx --fix
```

### Häufige Fehler — müssen vor Commit behoben sein

- **`no-unused-vars` / `@typescript-eslint/no-unused-vars`:** Jede importierte Variable, jeder importierte Typ und jede deklarierte Variable muss verwendet werden.
  ```tsx
  // FALSCH
  import { useState, useEffect } from 'react'; // useEffect wird nie genutzt

  // RICHTIG
  import { useState } from 'react';
  ```
  Ungenutzte Parameter in Callbacks mit `_` prefixen:
  ```tsx
  array.map((_item, index) => <div key={index} />)
  ```

- **`react-hooks/exhaustive-deps`:** Alle im `useEffect`/`useCallback` genutzten Variablen müssen im Dependency-Array stehen — keine ESLint-Disable-Kommentare als Lösung.

- **`no-console`:** Kein `console.log` im produktiven Code. Für Debug temporär erlaubt, muss vor Commit entfernt werden.

- **`@typescript-eslint/no-explicit-any`:** Kein `any` — immer konkreten Typ oder `unknown` verwenden.

- **`react/jsx-key`:** Jedes Element in `.map()` braucht ein stabiles `key`-Prop — niemals Array-Index:
  ```tsx
  // FALSCH
  items.map((item, i) => <Card key={i} />)

  // RICHTIG
  items.map((item) => <Card key={item.id} />)
  ```

### Keine `console.log` im produktiven Code.
- Keine hardcodierten API-URLs — immer `api/config.ts` verwenden.
- Keys in Listen immer stabile IDs, nie Array-Index: `key={item.id}` statt `key={index}`.
- Bilder und Assets in `public/` oder als Imports — keine externen URLs ohne Fallback.

## Dependencies hinzufügen

```bash
npm install <package>
npm install -D <package>   # devDependency
```

`package.json` und `package-lock.json` müssen nach jeder Änderung committet werden.
