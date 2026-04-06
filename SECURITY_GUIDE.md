# Sicherheits-Implementierung - Admin Authentifizierung

## Übersicht

Das Admin-System verwendet **JWT (JSON Web Tokens)** mit höchsten Sicherheitsstandards:

### 🔐 Sicherheitsfeatures

#### 1. **JWT Token-basierte Authentifizierung**
- **Access Tokens**: Kurzlebig (15 Minuten), gespeichert im Memory (nicht in localStorage/sessionStorage)
- **Refresh Tokens**: Langlebig (7 Tage), gespeichert in **HttpOnly Cookies**
- **Token Rotation**: Bei jedem Refresh wird ein neuer Token generiert
- **Token Blacklisting**: Alte Tokens werden nach Rotation ungültig gemacht

#### 2. **HttpOnly Cookies**
- Refresh Tokens werden in HttpOnly Cookies gespeichert
- **Nicht zugänglich via JavaScript** - Schutz vor XSS-Angriffen
- SameSite=Lax - Schutz vor CSRF-Angriffen
- Secure Flag (in Produktion aktivieren)

#### 3. **Automatische Token-Erneuerung**
- Access Token wird automatisch erneuert, wenn er abläuft
- Axios Interceptor fängt 401-Fehler ab und erneuert Token
- Nahtlose User Experience ohne erneuten Login

#### 4. **Request Queue Management**
- Mehrere gleichzeitige Requests warten auf Token-Erneuerung
- Verhindert Race Conditions bei parallelen API-Calls

#### 5. **Sichere Passwort-Verwaltung**
- Django's integrierte Passwort-Hashing (PBKDF2)
- Mindestlänge: 8 Zeichen
- Passwort-Validierung auf Backend-Seite

#### 6. **Berechtigungsprüfung**
- Nur Staff-Benutzer können sich einloggen
- Nur aktive Benutzer haben Zugriff
- Admin-Berechtigungen für Benutzerverwaltung

## Architektur

### Backend (Django)

```
/api/auth/login/      - Login mit Credentials, gibt Access Token zurück, setzt Refresh Token Cookie
/api/auth/logout/     - Logout, blacklisted Refresh Token, löscht Cookie
/api/auth/refresh/    - Erneuert Access Token via Refresh Token Cookie
/api/auth/user/       - Gibt aktuellen User zurück (benötigt Access Token)
/api/auth/csrf/       - CSRF Token für zusätzliche Sicherheit
```

### Frontend (React)

**Token Storage:**
- Access Token: In-Memory Variable (nicht persistent)
- Refresh Token: HttpOnly Cookie (vom Backend gesetzt)

**Axios Interceptors:**
1. Request Interceptor: Fügt Access Token zu jedem Request hinzu
2. Response Interceptor: Erneuert Token automatisch bei 401-Fehler

## Sicherheitseinstellungen

### Django Settings (`settings.py`)

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,           # Neue Tokens bei Refresh
    'BLACKLIST_AFTER_ROTATION': True,        # Alte Tokens ungültig machen
    'UPDATE_LAST_LOGIN': True,               # Login-Zeit aktualisieren
    'ALGORITHM': 'HS256',                    # Verschlüsselungsalgorithmus
}

# Cookie Security
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # Muss false sein für CSRF-Token-Zugriff
CSRF_COOKIE_SAMESITE = 'Lax'
```

### Produktion-Einstellungen

Für Produktion müssen folgende Einstellungen angepasst werden:

```python
DEBUG = False
SECRET_KEY = 'your-secure-random-key'  # Generieren mit secrets.token_urlsafe(50)

# HTTPS aktivieren
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000

# Erlaubte Hosts
ALLOWED_HOSTS = ['yourdomain.com']
CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
```

## Angriffsvektoren & Schutzmaßnahmen

| Angriff | Schutzmaßnahme |
|---------|----------------|
| **XSS (Cross-Site Scripting)** | Access Token in Memory, Refresh Token in HttpOnly Cookie |
| **CSRF (Cross-Site Request Forgery)** | SameSite Cookies, CSRF Tokens |
| **Token Theft** | Kurzlebige Access Tokens, Token Rotation |
| **Replay Attacks** | Token Blacklisting, JTI (JWT ID) Claims |
| **Man-in-the-Middle** | HTTPS (in Produktion), Secure Cookies |
| **Brute Force** | Django's Rate Limiting (kann hinzugefügt werden) |

## Best Practices

### ✅ Was wir tun
- Tokens niemals in localStorage/sessionStorage speichern
- HttpOnly Cookies für Refresh Tokens
- Automatische Token-Erneuerung
- Token Rotation und Blacklisting
- Kurzlebige Access Tokens
- Berechtigungsprüfung auf Backend

### ❌ Was wir vermeiden
- Tokens in localStorage (anfällig für XSS)
- Langlebige Access Tokens
- Tokens in URL-Parametern
- Fehlende Token-Validierung
- Unverschlüsselte Verbindungen (in Produktion)

## Installation & Setup

### 1. Backend-Abhängigkeiten installieren

```bash
cd backend
uv pip install -r requirements.txt
```

### 2. Datenbank migrieren (für Token Blacklist)

```bash
uv run python manage.py migrate
```

### 3. Superuser erstellen

```bash
uv run python manage.py createsuperuser
```

### 4. Backend starten

```bash
uv run python manage.py runserver 0.0.0.0:8000
```

### 5. Frontend starten

```bash
cd frontend
npm start
```

## Testing

### Login testen
1. Navigiere zu `http://localhost:3000/admin/login`
2. Melde dich mit Superuser-Credentials an
3. Du wirst zu `/admin` weitergeleitet

### Token-Erneuerung testen
1. Warte 15 Minuten (oder ändere `ACCESS_TOKEN_LIFETIME` auf 1 Minute)
2. Führe eine Admin-Aktion aus
3. Token sollte automatisch erneuert werden

### Logout testen
1. Klicke auf Benutzer-Icon → Abmelden
2. Refresh Token wird blacklisted
3. Du wirst zu `/admin/login` weitergeleitet

## Monitoring & Logging

Empfohlene Monitoring-Punkte:
- Fehlgeschlagene Login-Versuche
- Token-Erneuerungen
- Blacklisted Tokens
- Ungewöhnliche API-Zugriffsmuster

## Zukünftige Verbesserungen

- [ ] Rate Limiting für Login-Endpoint
- [ ] 2-Faktor-Authentifizierung (2FA)
- [ ] IP-basierte Zugriffskontrolle
- [ ] Audit Logs für Admin-Aktionen
- [ ] Automatische Session-Timeout bei Inaktivität
- [ ] Fingerprinting für zusätzliche Sicherheit

## Support & Fragen

Bei Sicherheitsfragen oder -bedenken, bitte sofort melden!
