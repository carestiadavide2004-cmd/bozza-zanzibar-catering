# Direzione artistica — Zeta Catering

Bozza per un cliente vero (bar di Torre de' Passeri). Sito separato dal menù digitale.

## L'idea in una frase
Un catering di paese che lavora come una maison: carta avorio, inchiostro caldo, un nome enorme in Bodoni che sta nel cielo delle foto, e tanta luce naturale dorata.

## Parole guida
Accoglienza abruzzese · cura dei dettagli · eleganza senza rigidità.

## Palette (contrasto WCAG calcolato)
| Ruolo | Colore | Uso | Contrasto |
|---|---|---|---|
| Avorio caldo | `#F6F1E8` | sfondo principale | — |
| Sabbia | `#EDE5D7` | sezioni alternate (modulo, FAQ) | — |
| Inchiostro | `#15120F` | testo, sezioni scure, footer | 16,6:1 su avorio |
| Grigio caldo | `#6B655D` | testi secondari su chiaro | 5,1:1 su avorio · 4,6:1 su sabbia |
| Pietra | `#A79D8E` | testi secondari su scuro | 7,0:1 su inchiostro |
| **Accento terracotta-zafferano** | `#A6461F` | SOLO etichette piccole, numeri dei passi, linea che si disegna, focus | 5,3:1 su avorio · 4,8:1 su sabbia |
| Accento su scuro | `#D98B5F` | lo stesso accento, schiarito, sulle sezioni inchiostro | 6,9:1 su inchiostro |

Regola: l'accento compare al massimo 2-3 volte per schermata. Mai come sfondo di grandi superfici.
I pulsanti principali sono avorio su foto/scuro e inchiostro su chiaro (luminosi, non colorati).

## Font (tutti nel sito, cartella `fonts/`, woff2, `font-display: swap`)
- **Bodoni Moda** variabile (asse optical size 6–96, peso 400–900, anche corsivo): nome gigante, titoli, frasi grandi. Ad alto contrasto: a grandi misure i filetti diventano sottilissimi, a piccole misure si irrobustisce da solo (`font-optical-sizing: auto`). Corsivo solo per una parola chiave dentro i titoli.
- **Manrope** variabile (200–800): testi, menu, pulsanti, moduli. Testo base 17px, campi del modulo 16px minimo.
- Etichette: Manrope 12–13px maiuscolo, spaziatura lettere 0,18em.

## Ritmo delle spaziature
- Base 8px. Scala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160.
- Margine laterale della pagina: da 16px (telefono) a 56px (computer grande). Contenuto max 1320px.
- Sezioni: padding verticale da 88px (telefono) a 168px (computer).
- Paragrafi: max 62 caratteri per riga.
- Alternanza: chiara-ariosa → chiara-densa → scura → scura con foto → chiara compatta → sabbia (modulo) → chiara → footer scuro.
- Raggi: quasi nulli (2px) sulle foto, pulsanti con angoli vivi (2px). Niente ombre pesanti.

## Firma visiva
1. Il **nome gigante** da bordo a bordo, una riga sola, misurato sui bordi reali delle lettere (margini sinistro e destro identici), nel cielo della foto.
2. Le **due strisce di foto** che scorrono in direzioni opposte, senza mai fermarsi al passaggio del mouse.
3. Parole in **corsivo Bodoni** dentro i titoli dritti (es. "Ogni evento ha il suo *sapore*").

## Regole delle animazioni (livello alto)
- Solo `transform`, `opacity`, `clip-path`. Easing `cubic-bezier(0.22, 1, 0.36, 1)`, durate 0,6–1,2 s.
- GSAP + ScrollTrigger + SplitText scaricati da cdnjs e serviti dal sito (`js/vendor/`): nessuna richiesta esterna.
- Entrata hero (≈1,6 s, una volta): foto da scala 1,08 a 1 → lettere del nome che salgono dietro una maschera, una alla volta → menu, sottotitolo, pulsante.
- Scorrimento: nome con parallasse lento e dissolvenza; foto grandi con tendina clip-path + ritorno di scala; titoli che salgono riga per riga; parallasse max 8%; una sezione che passa da avorio a inchiostro.
- Niente scroll-jacking, niente scroll "morbido" finto, niente rimbalzi o rotazioni.
- Un solo effetto forte per schermata.
- Nessun ricalcolo quando si apre la tastiera: si ricalcola solo se cambia la larghezza.
- `prefers-reduced-motion`: niente movimenti, solo dissolvenze brevi; strisce ferme, si scorrono con le frecce.

## Foto e video cercati (Pexels, scaricati nel sito)
Tono comune: luce naturale calda (golden hour o luce di giorno morbida), colori caldi e naturali, persone vere e non in posa da catalogo, nessun logo o scritta. Niente filtri, niente blur.

### Home
- **Hero (foto orizzontale + taglio verticale):** lunga tavola apparecchiata all'aperto al tramonto, oppure camerieri in divisa con vassoi, con il soggetto nella metà bassa e cielo pulito nella metà alta (per il nome).
- **Introduzione:** un dettaglio di mani al lavoro (impiattamento o servizio).
- **Card eventi:** un fotogramma verticale del video di ogni evento + una clip breve muta per il passaggio del mouse.
- **Strisce (2 file, ~14 foto):** il "mestiere": finger food, mise en place, calici, camerieri al lavoro, buffet, dolci, tavole all'aperto.
- **Zona servita:** riquadro con l'indirizzo (nessuna mappa caricata in automatico).

### Per ogni evento: 1 video hero (orizzontale 1920×1080 + verticale 1080×1920) e 8–10 foto
- **Matrimoni:** ricevimento all'aperto, brindisi, tavola imperiale con fiori, torta nuziale, camerieri con calici, sposi a tavola, dettagli di centrotavola.
- **Comunioni, battesimi e cresime:** pranzo in famiglia luminoso, tavola bianca e verde, torta e confettata, bambini e nonni, dolci piccoli.
- **Compleanni e feste private:** festa in giardino tra amici, candeline, brindisi, buffet colorato, luci la sera.
- **Eventi aziendali:** cena di gala o coffee break, networking con calici, buffet ordinato, sala allestita, camerieri in divisa.
- **Aperitivi e buffet:** spritz e calici, finger food, taglieri, bartender che versa, buffet all'aperto.
- **Lauree:** festa giovane tra amici, brindisi con le bollicine, torta, momenti di gioia (evitare il tocco americano se possibile).

### Video
- MP4 H.264, senza audio, frame rate costante, 1920×1080 e 1080×1920 (taglio verticale ricavato da sorgenti 4K), loop con dissolvenza invisibile, poster WebP.
- Il video parte solo quando è sullo schermo e ne va uno solo alla volta.

Elenco finale con i link Pexels: `credits.md`.
