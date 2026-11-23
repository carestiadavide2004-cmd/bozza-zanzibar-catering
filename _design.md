# Design — Zeta Catering

**Tipo:** catering ed eventi · **Zona:** tutto l'Abruzzo e regioni limitrofe (sede a Torre de' Passeri) · **Stato:** bozza per cliente reale (noindex)
Dettagli completi in `DIREZIONE.md`. Dati e testi in `config.js`.

## Direzione
Maison di paese: avorio caldo, inchiostro, "Zeta" gigante in Bodoni nel cielo delle foto con "Catering" in maiuscoletto sotto, luce dorata naturale.

## Font (in `fonts/`)
- Titoli: Bodoni Moda variabile (opsz 6–96, 400–900, corsivo per le parole chiave)
- Testo: Manrope variabile (400–700)

## Palette
Avorio `#F6F1E8` · Sabbia `#EDE5D7` · Inchiostro `#15120F` · Grigio caldo `#6B655D` · Pietra (su scuro) `#A79D8E` · Accento `#A6461F` (su scuro `#D98B5F`)

## Firma visiva
Nome gigante da bordo a bordo (fit text sui bordi reali delle lettere) + due strisce di foto in direzioni opposte.

## Animazioni
Livello 3 con GSAP/ScrollTrigger/SplitText locali. Solo transform, opacity, clip-path. Easing cubic-bezier(.22,1,.36,1), 0,6–1,2 s.

## Regole da non violare
- Accento solo su dettagli piccoli; pulsanti avorio/inchiostro.
- Nessuna richiesta esterna al caricamento; Maps solo al clic.
- Nessun credito dell'autore del sito in nessuna pagina.
- Foto: natural ratio nelle strisce (niente tagli), object-position deciso per hero e card.
