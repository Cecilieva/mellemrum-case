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

### Deploy og direkte routes

Åbn den deployede GitHub Pages-version via linket under [Live løsning](#live-løsning). Test både forsiden og direkte routes, for eksempel `/om`, `/tilmeldinger` og `/events/<event-id>`. Genindlæs hver direkte route for at kontrollere, at GitHub Pages-opsætningen håndterer SPA-routing korrekt.

### Branches og commits

Arbejd på én feature branch ad gangen, oprettet fra den aktuelle hovedbranch. Hold ændringerne fokuserede, og lav forståelige commits med korte handlingsbeskrivelser, for eksempel `Tilføj eventfiltrering` eller `Forbedr loading state`. Kør lint og build før merge, og merge først branchen, når den manuelle test er gennemført.
