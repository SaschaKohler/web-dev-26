# Backend Agent Guidelines

## Stack & Tooling

- **Runtime:** Python 3.12 via `uv`
- **Framework:** Django 5.x + Django REST Framework
- **Auth:** JWT via `djangorestframework-simplejwt`
- **DB:** SQLite (local) / PostgreSQL via `DATABASE_URL` (production)
- **Deployment:** Railway (Gunicorn + WhiteNoise)

### uv Commands

```bash
# Dependencies hinzufügen
uv add <package>

# Dependencies entfernen
uv remove <package>

# Skript/Management-Befehl ausführen
uv run python manage.py <command>

# Tests ausführen (immer aus dem backend/-Verzeichnis)
uv run pytest

# Einzelne Testdatei
uv run pytest tests/test_<module>.py -v

# Spezifischen Test
uv run pytest tests/test_<module>.py::TestClass::test_method -v
```

> Alle Befehle werden aus dem Verzeichnis `backend/` ausgeführt.
> Niemals `pip install` direkt verwenden — immer `uv add`.

---

## Projektstruktur

```
backend/
├── cms/                    # Django-Projektkonfiguration
│   ├── settings.py         # Einstellungen (env-basiert)
│   ├── urls.py             # Root URL-Konfiguration
│   └── wsgi.py / asgi.py
├── cms_pages/              # Haupt-App (Models, Views, Serializers)
│   ├── models.py
│   ├── serializers.py
│   ├── views.py            # ViewSets
│   ├── urls.py
│   ├── middleware.py       # TenantMiddleware
│   ├── migrations/
│   └── services/           # Business-Logik (von Views getrennt)
├── tests/                  # Test-Suite
│   ├── conftest.py         # Fixtures & Factories
│   ├── test_models.py
│   ├── test_serializers.py
│   ├── test_api_views.py
│   ├── test_auth.py
│   ├── test_middleware.py
│   └── test_analytics.py
├── pyproject.toml          # Abhängigkeiten & Tool-Konfiguration
└── manage.py
```

---

## Django Best Practices

### Models

- Jedes Model bekommt `__str__` und `class Meta` mit `ordering` und `verbose_name`.
- Geschäftslogik gehört in `services/`, nicht in Models oder Views.
- Migrations immer mit `uv run python manage.py makemigrations` erstellen, nie manuell editieren.
- `BigAutoField` als `DEFAULT_AUTO_FIELD` (bereits in settings.py gesetzt).

### Views & Serializers

- **ViewSets** für alle CRUD-Ressourcen verwenden (`ModelViewSet` oder `ReadOnlyModelViewSet`).
- Permissions explizit pro ViewSet setzen — niemals auf den globalen Default `AllowAny` verlassen.
- Serializer-Validierung in `validate_<field>()` und `validate()` Methoden — keine Logik in Views.
- Custom Actions via `@action(detail=True/False, methods=[...])`.

### Authentication

- JWT via `simplejwt` — Access Token (15 min), Refresh Token (7 Tage, rotierend).
- Geschützte Endpunkte mit `permission_classes = [IsAuthenticated]` dekorieren.
- Token-Blacklisting ist aktiv (`rest_framework_simplejwt.token_blacklist`).

### Settings

- Alle Secrets und Konfigurationen über Umgebungsvariablen (`os.environ.get`).
- Niemals Secrets hardcoden — `.env`-Datei lokal, Railway-Variablen in Produktion.
- `DEBUG=True` nur lokal; in Produktion via `DATABASE_URL` automatisch erkannt.

### Migrations

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

- Migrations committen — sie gehören zum Versionskontrollsystem.
- Bei Datenmigration: separaten `RunPython`-Schritt in eigener Migration erstellen.

---

## Testing

### Grundregeln

- **Jede neue Funktion, jedes neues Model, jeder neuer Endpoint bekommt Tests.**
- Tests werden in `tests/` abgelegt, Dateiname: `test_<modul>.py`.
- Factories für Testdaten verwenden (`factory_boy`) — keine rohen `Model.objects.create()` in Tests.
- Fixtures und Factories gehören in `tests/conftest.py`.

### Test ausführen

```bash
# Alle Tests
uv run pytest

# Mit frischer Datenbank
uv run pytest --no-reuse-db

# Nur ein Marker
uv run pytest -m api
uv run pytest -m auth
uv run pytest -m models

# Verbose mit Output
uv run pytest -v -s tests/test_api_views.py
```

### Verfügbare Marker

| Marker | Verwendung |
|---|---|
| `@pytest.mark.models` | Model-Tests |
| `@pytest.mark.serializers` | Serializer-Tests |
| `@pytest.mark.api` | ViewSet / API-Tests |
| `@pytest.mark.auth` | Authentifizierung |
| `@pytest.mark.analytics` | Analytics-Endpunkte |
| `@pytest.mark.middleware` | Middleware-Tests |
| `@pytest.mark.integration` | End-to-End / Integration |

### Test-Struktur

```python
import pytest
from django.urls import reverse
from rest_framework import status
from .conftest import UserFactory, SiteFactory  # Factories aus conftest

@pytest.mark.django_db
class TestMeinFeature:
    def test_erwartetes_verhalten(self, api_client, admin_user):
        url = reverse("mein-endpoint-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_unauthenticated_wird_abgewiesen(self, api_client):
        url = reverse("mein-endpoint-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

### Was getestet werden muss

- **Models:** Felder, Defaults, `__str__`, Validierung, Custom Methods
- **Serializers:** Valide Daten, invalide Daten, computed fields, read-only fields
- **API ViewSets:** CRUD-Operationen, Permissions (authenticated / unauthenticated), Custom Actions
- **Middleware:** Request-Verarbeitung, Edge Cases
- **Auth:** Login, Logout, Token-Refresh, geschützte Routen

---

## Multitenant-Architektur

- `TenantMiddleware` (`cms_pages/middleware.py`) setzt `request.site` anhand des `Host`-Headers.
- Jeder ViewSet filtert Daten per `request.site` — niemals site-übergreifende Daten zurückgeben.
- Tests müssen immer mit einem konkreten `Site`-Objekt und korrektem `HTTP_HOST`-Header arbeiten.

```python
# Beispiel: Site-kontext in Tests setzen
response = api_client.get(url, HTTP_HOST="test.example.com")
```

---

## Code-Qualität & Linting

**Vor jedem Commit und Push müssen alle Linting-Fehler behoben sein.**

```bash
# Ungenutzte Imports & Variablen prüfen (pyflakes via ruff)
uv run ruff check .

# Mit Auto-Fix
uv run ruff check . --fix
```

> Falls `ruff` noch nicht installiert ist: `uv add --dev ruff`

### Häufige Fehler — müssen vor Commit behoben sein

- **`F401` — unused import:** Jeder Import muss verwendet werden.
  ```python
  # FALSCH
  from django.db import models, transaction  # transaction wird nie genutzt

  # RICHTIG
  from django.db import models
  ```

- **`F841` — unused variable:** Keine Variablen deklarieren, die nie genutzt werden.
  ```python
  # FALSCH
  result = queryset.filter(...)  # result wird nie verwendet
  return Response(queryset.filter(...))

  # RICHTIG — direkt zurückgeben
  return Response(queryset.filter(...))
  ```

- **`E501` — line too long:** Zeilen auf max. 120 Zeichen begrenzen.

- Keine hardcodierten Strings für URLs — immer `reverse()` verwenden.
- Queryset-Optimierung: `select_related()` / `prefetch_related()` wo nötig.
- Bei neuen Dependencies: `uv add <package>` — `pyproject.toml` und `uv.lock` werden automatisch aktualisiert und müssen committet werden.
