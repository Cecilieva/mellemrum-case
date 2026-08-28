# Mellemrum

Mellemrum er en lokal kultur- og eventplatform, hvor brugere kan finde events, se eventdetaljer og tilmelde sig. Arrangører kan få overblik over de tilmeldte deltagere.

## Live løsning

[Åbn den deployede løsning](INDSÆT-LINK-HER)

## Kom i gang lokalt

Installér dependencies:

```bash
npm install
```

## Arbejdsgang og test

### Lokale environment variables

Opret en lokal `.env.local` i projektets rodmappe. Brug kun dine egne lokale værdier, og commit ikke filen:

```env
VITE_SUPABASE_URL=din-supabase-url
VITE_SUPABASE_APIKEY=din-supabase-api-key
```

Environment variables med præfikset `VITE_` bruges af Vite i frontend-buildet. Del aldrig nøgler eller andre hemmelige værdier i README, commits eller screenshots.

### Kvalitetstjek og lokal test

Kør kommandoerne fra projektets rodmappe:

```bash
npm run lint
npm run build
npm run preview
```

Åbn preview-adressen, og gennemgå manuelt:

- Eventoversigten viser events, og søgning samt kategori-filter virker.
- Et event kan åbnes fra oversigten, og eventdetaljen viser de forventede oplysninger.
- En tilmelding kan oprettes med navn og e-mail, og der vises en tydelig succes- eller fejlbesked.
- `/tilmeldinger` viser de registrerede tilmeldinger og eventoplysninger.


## Forbedringer i Case 1

Mellemrum er blevet forbedret med fokus på tilmeldingsflow, robusthed, accessibility, kodekvalitet og deployment.

### Tilmeldingsflow

Tilmeldingsformularen på eventdetaljesiden gemmer nu tilmeldinger i Supabase-tabellen `registrations`.

Formularen:

- sender navn, e-mail, status og oplysninger om det valgte event
- viser loading-feedback, mens tilmeldingen behandles
- deaktiverer felter og knap under indsendelse for at undgå dobbelte tilmeldinger
- viser en succesbesked og nulstiller felterne ved succes
- viser en brugervenlig fejlbesked, hvis tilmeldingen ikke kan gemmes
- bruger labels, `required`, `type="email"` og autocomplete-attributter

### Data og UI-states

Siderne håndterer nu de vigtigste tilstande ved datahentning:

- loading, mens events eller tilmeldinger hentes
- fejlbesked med mulighed for at prøve igen
- empty state, når der ikke findes data
- not-found state, hvis et event ikke findes
- tydelig besked og nulstil-knap, når en søgning ikke giver resultater

### Supabase og kodearkitektur

Supabase-konfiguration og API-kald er samlet, så URL, headers og fetch-logik ikke gentages i flere komponenter.

API-laget er opdelt efter ansvar:

- `src/api/supabase.js` – fælles Supabase-request og konfiguration
- `src/api/events.js` – hentning af events
- `src/api/registrations.js` – hentning og oprettelse af tilmeldinger

Dette gør page-komponenterne mere overskuelige, fordi de primært håndterer UI og state.

### Accessibility og navigation

Løsningen er forbedret med fokus på tastaturbrug og forståelig feedback:

- synlig fokusmarkering på links, knapper og formularfelter
- semantiske labels i formularen
- status- og fejlbeskeder, der kan læses af skærmlæsere
- logisk heading-hierarki
- opdatering af sidetitel ved navigation
- fokus flyttes til sidens overskrift ved route-skift
- siden scroller til toppen, når brugeren navigerer til en ny route

### Fælles komponenter og styling

Footeren er samlet i en fælles komponent og vises via det fælles layout i `App.jsx`. Det fjerner gentaget kode og sikrer ens indhold på alle sider.

Styling af loading, fejl, succes og tomme lister er samlet, så feedbackmønstre er konsistente på tværs af løsningen.

### Performance og Lighthouse

Hero-billedet ligger lokalt som `public/hero.webp` i stedet for at blive hentet fra en ekstern billedtjeneste. Det er komprimeret til WebP og preloadet i `index.html`, så forsiden hurtigere kan vise sit største indholdselement. Referencen bruger Vites `BASE_URL`, så den virker både lokalt og på GitHub Pages.

Mål Lighthouse under samme betingelser før og efter ændringer. Den oprindelige lokale måling var performance-score 63 med en LCP på 5,2 sekunder. Kør målingen både mod `npm run preview` efter `npm run build` og mod den deployede GitHub Pages-version, og notér den nye score og LCP i projektets dokumentation.

### Deploy og direkte routes

Åbn den deployede GitHub Pages-version via linket under [Live løsning](#live-løsning). Test både forsiden og direkte routes, for eksempel `/om`, `/tilmeldinger` og `/events/<event-id>`. Genindlæs hver direkte route for at kontrollere, at GitHub Pages-opsætningen håndterer SPA-routing korrekt.

### Branches og commits

Arbejd på én feature branch ad gangen, oprettet fra den aktuelle hovedbranch. Hold ændringerne fokuserede, og lav forståelige commits med korte handlingsbeskrivelser, for eksempel `Tilføj eventfiltrering` eller `Forbedr loading state`. Kør lint og build før merge, og merge først branchen, når den manuelle test er gennemført.

## Lokal opsætning

Opret en `.env`-fil i projektets rodmappe:

```env
VITE_SUPABASE_URL=https://dit-projekt.supabase.co/rest/v1
VITE_SUPABASE_APIKEY=din-publishable-key