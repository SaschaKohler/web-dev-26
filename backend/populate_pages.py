import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import Page

pages_data = [
    {
        'title': 'Willkommen',
        'slug': 'home',
        'content': '''Herzlich willkommen auf meiner Website!

Als zertifizierte/r Lebens- und Sozialberater/in unterstütze ich Sie professionell bei persönlichen und beruflichen Herausforderungen.

In einem geschützten Rahmen begleite ich Sie auf Ihrem Weg zu mehr Klarheit, Lebensfreude und innerer Balance.

Vereinbaren Sie jetzt Ihren persönlichen Beratungstermin.'''
    },
    {
        'title': 'Über mich',
        'slug': 'about',
        'content': '''Mein Name ist [Name] und ich bin zertifizierte/r Lebens- und Sozialberater/in mit Gewerbeberechtigung nach § 119 GewO.

Ausbildung & Qualifikationen:
- Diplom Lebens- und Sozialberatung
- [Weitere Ausbildungen]
- [Zusatzqualifikationen]

Meine Schwerpunkte:
- Persönlichkeitsentwicklung
- Stressbewältigung
- Beziehungsthemen
- Berufliche Neuorientierung

Ich arbeite nach den Grundsätzen der humanistischen Psychologie und lege großen Wert auf eine vertrauensvolle, wertschätzende Atmosphäre.'''
    },
    {
        'title': 'Leistungen',
        'slug': 'services',
        'content': '''Meine Beratungsangebote:

Einzelberatung
- Dauer: 50 Minuten
- Kosten: € [Betrag] pro Sitzung
- Persönlich oder online möglich

Paarberatung
- Dauer: 90 Minuten
- Kosten: € [Betrag] pro Sitzung

Themen:
✓ Persönliche Krisen und Übergangsphasen
✓ Stress und Burnout-Prävention
✓ Selbstwert und Selbstfindung
✓ Beziehungskonflikte
✓ Berufliche Veränderung
✓ Entscheidungsfindung

Ablauf einer Beratung:
1. Kostenloses Erstgespräch (15 Min.)
2. Gemeinsame Zielsetzung
3. Individuelle Begleitung
4. Regelmäßige Reflexion

Die Beratung unterliegt der Verschwiegenheitspflicht.'''
    },
    {
        'title': 'Terminbuchung',
        'slug': 'booking',
        'content': '''Buchen Sie hier Ihren Beratungstermin:

[Cal.com Buchungssystem wird hier eingebettet]

Verfügbare Zeiten:
Montag - Freitag: 9:00 - 18:00 Uhr
Nach Vereinbarung auch abends möglich

Standort:
[Adresse]
[PLZ Ort]

Online-Beratung:
Termine auch via Zoom/Skype möglich'''
    },
    {
        'title': 'Häufige Fragen',
        'slug': 'faq',
        'content': '''Häufig gestellte Fragen:

Was ist Lebens- und Sozialberatung?
LSB ist eine professionelle Beratung für Menschen in schwierigen Lebenssituationen. Im Unterschied zur Psychotherapie arbeiten wir mit gesunden Menschen an konkreten Fragestellungen und Zielen.

Wie unterscheidet sich LSB von Psychotherapie?
Lebensberatung richtet sich an psychisch gesunde Menschen und ist lösungs- und ressourcenorientiert. Bei psychischen Erkrankungen ist Psychotherapie die richtige Anlaufstelle.

Was kostet eine Beratung?
Eine Einzelsitzung (50 Min.) kostet € [Betrag]. Ein kostenloses Erstgespräch (15 Min.) ist möglich.

Werden die Kosten von der Krankenkasse übernommen?
Lebensberatung ist eine Privatleistung und wird in der Regel nicht von der Krankenkasse übernommen. Manche Zusatzversicherungen bieten jedoch Zuschüsse.

Wie viele Sitzungen brauche ich?
Das ist sehr individuell. Manche Themen lassen sich in 3-5 Sitzungen bearbeiten, andere benötigen längere Begleitung.

Unterliegt die Beratung der Verschwiegenheit?
Ja, als konzessionierte/r LSB unterliege ich der gesetzlichen Verschwiegenheitspflicht.'''
    },
    {
        'title': 'Kontakt',
        'slug': 'contact',
        'content': '''Kontaktieren Sie mich:

[Name]
Lebens- und Sozialberatung

Adresse:
[Straße Hausnummer]
[PLZ Ort]

Telefon: [Telefonnummer]
E-Mail: [E-Mail-Adresse]

Erreichbarkeit:
Montag - Freitag: 9:00 - 18:00 Uhr

Ich freue mich auf Ihre Nachricht!

Hinweis: Bitte beachten Sie, dass E-Mails nicht für akute Krisen geeignet sind. In Notfällen wenden Sie sich bitte an die Telefonseelsorge (142) oder den Notruf (144).'''
    },
    {
        'title': 'Impressum',
        'slug': 'impressum',
        'content': '''Impressum

Informationspflicht laut §5 E-Commerce Gesetz, §14 Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz.

[Vorname Nachname]
[Straße Hausnummer]
[PLZ Ort]
Österreich

Unternehmensgegenstand: Lebens- und Sozialberatung
UID-Nummer: [UID]

Tel.: [Telefonnummer]
E-Mail: [E-Mail]

Mitglied bei: WKO
Berufsrecht: Gewerbeordnung: www.ris.bka.gv.at

Aufsichtsbehörde/Gewerbebehörde: [Bezirkshauptmannschaft/Magistrat]
Berufsbezeichnung: Lebens- und Sozialberater/in
Verleihungsstaat: Österreich

Angaben zur Online-Streitbeilegung:
Verbraucher haben die Möglichkeit, Beschwerden an die Online Streitbeilegungsplattform der EU zu richten: http://ec.europa.eu/odr
Sie können allfällige Beschwerde auch an die oben angegebene E-Mail-Adresse richten.

Haftung für Inhalte dieser Website:
Wir entwickeln die Inhalte dieser Website ständig weiter und bemühen uns korrekte und aktuelle Informationen bereitzustellen. Leider können wir keine Haftung für die Korrektheit aller Inhalte auf dieser Website übernehmen, speziell für jene, die seitens Dritter bereitgestellt wurden.

Datenschutz:
Siehe separate Datenschutzerklärung.'''
    }
]

print("Populating database with LSB pages...")

for page_data in pages_data:
    page, created = Page.objects.update_or_create(
        slug=page_data['slug'],
        defaults={
            'title': page_data['title'],
            'content': page_data['content']
        }
    )
    if created:
        print(f"✓ Created page: {page.title}")
    else:
        print(f"✓ Updated page: {page.title}")

print(f"\nTotal pages in database: {Page.objects.count()}")
print("Done!")
