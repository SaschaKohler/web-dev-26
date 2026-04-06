# LSB Website - Deployment Guide

## For Each New Client

### 1. Clone the Template
```bash
git clone [your-repo] lsb-client-[name]
cd lsb-client-[name]
```

### 2. Backend Setup
```bash
cd backend

# Create new virtual environment
uv venv
uv pip install -r requirements.txt

# Initialize database
uv run python manage.py migrate

# Create admin user
uv run python create_superuser.py

# Populate with default content
uv run python populate_pages.py
```

### 3. Customize Content

**Via Django Admin:**
1. Start server: `uv run python manage.py runserver`
2. Go to: http://localhost:8000/admin
3. Login: admin / admin123
4. Edit each page with client-specific information

**Required Customizations:**
- **Home:** Client's welcome message, specializations
- **About:** Client's bio, qualifications, photo
- **Services:** Client's pricing, session types
- **Booking:** Cal.com link (see step 4)
- **Contact:** Client's address, phone, email
- **Impressum:** All [placeholder] fields with client data
- **DSGVO:** Add as new page using legal_templates/dsgvo_template.md

### 4. Cal.com Setup

1. Create Cal.com account for client
2. Get booking link
3. Update `frontend/src/pages/Booking.tsx`:
   ```tsx
   <Cal calLink="client-username/30min" />
   ```

### 5. Frontend Customization

**Theme Colors** (`frontend/src/App.tsx`):
```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change to client's brand color
    },
  },
});
```

**Site Title** (`frontend/public/index.html`):
```html
<title>[Client Name] - Lebensberatung</title>
```

### 6. Production Deployment

**Backend Options:**
- Railway.app (recommended for Django)
- Heroku
- DigitalOcean App Platform
- VPS with Nginx + Gunicorn

**Frontend Options:**
- Netlify (recommended)
- Vercel
- Cloudflare Pages

**Database:**
- For production, migrate from SQLite to PostgreSQL
- Update `backend/cms/settings.py` DATABASES config

### 7. Domain Setup

1. Client purchases domain (e.g., `www.client-name.at`)
2. Point DNS to hosting provider
3. Enable SSL/HTTPS
4. Update CORS settings in `backend/cms/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       'https://www.client-name.at',
   ]
   ```

### 8. Google Business Profile

1. Create/claim Google Business Profile for client
2. Add website link
3. Add booking link
4. Verify business address
5. Add photos and description

### 9. Client Handover

**Provide:**
- Django admin credentials (change from default!)
- Cal.com login
- Google Business access
- Loom video tutorial (~15 min) showing:
  - How to edit page content
  - How to manage bookings
  - How to update contact info

**Documentation:**
- Link to this deployment guide
- Emergency contact (you)
- Hosting provider support

### 10. Post-Launch Checklist

- [ ] All pages have client-specific content
- [ ] Impressum is legally compliant
- [ ] DSGVO page added and complete
- [ ] Cal.com booking works
- [ ] Contact form/email tested
- [ ] Mobile responsive checked
- [ ] SSL certificate active
- [ ] Google Business Profile live
- [ ] Client can login to admin
- [ ] Client trained on content updates

## Pricing Reminder

**Starter Package (€890):**
- Website deployment
- 7 pages with content
- Legal templates (Impressum, DSGVO)
- Admin access

**Pro Package (€1,490):**
- Everything in Starter
- Cal.com booking integration
- Google Business setup
- 15-min Loom tutorial
- 1 month email support

**Annual Add-on (€149/year):**
- DSGVO compliance review
- Legal template updates
- Security updates

## Time Estimates

- Initial setup: 2 hours
- Content customization: 3-4 hours
- Cal.com + Google Business: 1 hour
- Deployment: 2 hours
- Client training: 1 hour

**Total: ~10 hours per client**

## Support SLA

**Included in price:**
- 48-hour deployment guarantee
- 1 week post-launch bug fixes

**Not included:**
- Content changes after handover
- Feature additions
- Ongoing maintenance

Offer these as separate hourly services (€80-100/hour).
