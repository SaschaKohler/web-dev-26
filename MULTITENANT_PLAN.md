# LSB Website Builder - Multi-Tenant Implementierungsplan

## Ziel
Multi-Tenant SaaS-System: Jeder LSB bekommt eigene Subdomain (kunde.lsbwebsites.at)

## Technische Architektur

### Stack
- **Backend**: Django REST API (erweitert für Multi-Tenant)
- **Frontend**: React (mit Subdomain-Routing)
- **Database**: PostgreSQL (eine DB, row-level isolation)
- **Hosting**: Railway.app
- **Frontend Hosting**: Vercel
- **DNS**: Cloudflare (Wildcard SSL *.lsbwebsites.at)
- **Payments**: Stripe
- **Auth**: JWT mit Site-Isolation

### Datenmodell
```
Site (Tenant-Container)
├── subdomain (unique)
├── owner (User FK)
├── plan (starter/pro/premium)
├── is_active
├── created_at
└── cal_link

Alle Content-Modelle erhalten ForeignKey zu Site:
- Page.site
- PageLayout.site  
- DesignTemplate.site
- SiteSettings.site
- DecadeTheme (global, aber Site-Activation)
```

### Middleware-Flow
1. Request kommt auf subdomain.lsbwebsites.at
2. TenantMiddleware extrahiert Subdomain
3. Site-Objekt wird in request.site geladen
4. Alle Queries filtern automatisch nach request.site

### Security
- Row-Level Security in PostgreSQL
- ORM-Filtering: Model.objects.filter(site=request.site)
- Keine Cross-Site-Datenlecks möglich

## Implementierungsphasen

### Phase 1: Core Multi-Tenant (Woche 1)
- [ ] Site Model erstellen
- [ ] TenantMiddleware implementieren
- [ ] Alle Models mit Site-FK erweitern
- [ ] Subdomain-Routing im Frontend

### Phase 2: Onboarding & Auth (Woche 2)
- [ ] Self-Service Registrierung
- [ ] Stripe-Integration
- [ ] Automatische Site-Erstellung
- [ ] Welcome-Email mit Login

### Phase 3: Admin & Management (Woche 3)
- [ ] Super-Admin Dashboard
- [ ] Site-Management
- [ ] Billing-Integration
- [ ] Analytics

### Phase 4: Launch (Woche 4)
- [ ] Landingpage
- [ ] Stripe Live
- [ ] DNS/SSL
- [ ] Monitoring

## Pricing
- Starter: €29/Monat (oder €890 einmalig)
- Pro: €49/Monat (oder €1.490 einmalig)
- Premium: €79/Monat

## Kosten pro Kunde
- Railway: ~€5/Monat
- Marge: €24-74/Monat pro Kunde

---
Erstellt: April 2026
Status: In Umsetzung
