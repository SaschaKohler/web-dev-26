# LSB Website - Django + React

Modern website solution for Austrian Lebens- und Sozialberater with customizable themes and content management.

## Project Structure

```
web-dev-26/
├── backend/          # Django REST API + CMS
├── frontend/         # React frontend
└── legal_templates/  # Austrian legal templates (Impressum, DSGVO)
```

## Quick Start

### Backend (Django)

```bash
cd backend

# Install dependencies with uv
uv venv
uv pip install -r requirements.txt

# Run migrations (if needed)
uv run python manage.py migrate

# Start development server
uv run python manage.py runserver
```

Backend runs at: http://localhost:8000
- API: http://localhost:8000/api/pages/
- Admin: http://localhost:8000/admin/
  - Username: `admin`
  - Password: `admin123`

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: http://localhost:3000

## Features

### Current Implementation

✅ **Django Backend CMS**
- REST API for page content management
- SQLite database with Page model
- Django admin interface for content editing
- CORS configured for frontend communication

✅ **React Frontend**
- Material-UI components
- 7 pre-configured pages:
  - Home (Willkommen)
  - About (Über mich)
  - Services (Leistungen)
  - Booking (Terminbuchung)
  - FAQ (Häufige Fragen)
  - Contact (Kontakt)
  - Impressum
- Cal.com integration ready (placeholder)

✅ **Pre-populated Content**
- All pages have Austrian LSB-specific template content
- German language
- Professional structure

### Database

All pages are pre-populated with LSB-specific content in German. Edit via:
1. Django Admin: http://localhost:8000/admin/
2. Or directly in database: `backend/db.sqlite3`

## Content Management

### Via Django Admin
1. Navigate to http://localhost:8000/admin/
2. Login with admin credentials
3. Go to "Pages" section
4. Edit any page content
5. Changes appear immediately on frontend

### Via Database Script
Run `backend/populate_pages.py` to reset all pages to default content:
```bash
cd backend
uv run python populate_pages.py
```

## Legal Compliance (Austria)

The Impressum page includes Austrian legal requirements:
- § 5 E-Commerce Gesetz
- § 14 Unternehmensgesetzbuch
- § 63 Gewerbeordnung
- § 25 Mediengesetz

**Note:** Legal templates need to be customized for each client with their specific information.

## Cal.com Integration

The Booking page is ready for Cal.com integration:
1. Get Cal.com account
2. Update `frontend/src/pages/Booking.tsx`
3. Replace `"your-cal-link"` with actual Cal.com link

## Tech Stack

**Backend:**
- Django 6.0.3
- Django REST Framework 3.17.1
- django-cors-headers 4.9.0
- SQLite database

**Frontend:**
- React 19.2.4
- TypeScript 4.9.5
- Material-UI 7.3.9
- React Router 7.14.0
- Axios 1.14.0
- Cal.com Embed React 1.5.3

## Development Status

- ✅ Backend configuration complete
- ✅ API routes configured
- ✅ Database initialized with content
- ✅ Decade theme system implemented
- ✅ Admin dashboard with neutral theme
- 🔄 Testing and refinement ongoing
