// Genera le pagine HTML del sito a partire da config.js
// Uso:  node _strumenti/genera.mjs
// (i testi si aggiornano comunque da soli da config.js; questo script serve
//  per titoli e descrizioni delle pagine, anteprime social e struttura)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(ROOT, 'config.js'), 'utf8'), ctx);
const S = ctx.window.SITO;
const URL_SITO = S.indirizzoSito.replace(/\/?$/, '/');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const enfasi = s => esc(s).replace(/\*(.+?)\*([,.;:!?]+)/g, '*$1$2*').replace(/\*(.+?)\*/g, '<em>$1</em>');
const prendi = p => p.split('.').reduce((o, k) => (o == null ? o : o[k]), S);
const t = p => esc(prendi(p));
const h = p => enfasi(prendi(p));
const C = S.contatti, L = S.legale;
const indirizzo = `${C.indirizzo}, ${C.cap} ${C.citta} (${C.provincia})`;
const fitK = s => (s.length * 0.53).toFixed(2);

const I = {
  freccia: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h13M9.5 3.5 14 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  giu: '<svg class="freccina" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 19.8l1.1-3.9A8.3 8.3 0 1 1 8.4 19l-4.2.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6 6 0 0 0 2.6 2.2c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .7-.4 1.4-1 1.7-.7.3-1.6.4-3.3-.4a8.5 8.5 0 0 1-3.6-3.6c-.6-1.2-.6-2.3.1-3.4Z" fill="currentColor"/></svg>',
};
const dl = x => `<span class="dl"><span>${x}</span><span aria-hidden="true">${x}</span></span>`;

/* ---------------- parti comuni ---------------- */
function testa({ titolo, descrizione, base, og, percorso, extra = '' }) {
  return `<!doctype html>
<html lang="it" data-base="${base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titolo)}</title>
<meta name="description" content="${esc(descrizione)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#15120F">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="${esc(S.nome)} · ${esc(S.sottotitolo)}">
<meta property="og:title" content="${esc(titolo)}">
<meta property="og:description" content="${esc(descrizione)}">
<meta property="og:url" content="${URL_SITO}${percorso}">
<meta property="og:image" content="${URL_SITO}assets/og/${og}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}assets/icone/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${base}assets/icone/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${base}assets/icone/apple-touch-icon.png">
<link rel="preload" href="${base}fonts/bodoni-moda-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
${extra}<link rel="stylesheet" href="${base}css/style.css">
<script>document.documentElement.classList.add('js')</script>
<script src="${base}config.js" defer></script>
<script src="${base}js/vendor/gsap.min.js" defer></script>
<script src="${base}js/vendor/ScrollTrigger.min.js" defer></script>
<script src="${base}js/vendor/SplitText.min.js" defer></script>
<script src="${base}js/main.js" defer></script>
</head>`;
}

function intestazione({ base, home, evento }) {
  const sez = id => (home ? `#${id}` : evento ? `#${id}` : `${base}index.html#${id}`);
  return `<a class="salta" href="#contenuto">Vai al contenuto</a>
<header class="hd" data-header>
  <div class="hd__fondo" aria-hidden="true"></div>
  <nav class="hd__nav wrap" aria-label="Menu principale" data-entra>
    <div class="hd__sx solo-pc">
      <button class="hd__link" type="button" aria-expanded="false" aria-controls="tendina-eventi" data-tendina-btn>${dl(`Eventi ${I.giu}`)}</button>
      <a class="hd__link" href="${sez('come-lavoriamo')}">${dl('Come lavoriamo')}</a>
      <a class="hd__link" href="${sez('galleria')}">${dl('Galleria')}</a>
    </div>
    <a class="hd__marchio" href="${base}index.html" aria-label="${esc(S.nome)}, torna alla pagina principale">${dl(`${esc(S.nome)}<small>${esc(S.sottotitolo)}</small>`)}</a>
    <div class="hd__dx">
      <a class="hd__link solo-pc" href="${sez('contatti')}">${dl('Contatti')}</a>
      <a class="btn btn--piccolo hd__cta" href="${sez('preventivo')}"><span class="btn__fondi" aria-hidden="true"></span>${dl('Preventivo')}</a>
      <button class="burger solo-tel" type="button" aria-expanded="false" aria-controls="menu-telefono" data-burger><span class="sr-only">Apri il menu</span><span class="burger__l"></span><span class="burger__l"></span></button>
    </div>
    <div class="tendina" id="tendina-eventi" data-tendina hidden>
      <ul class="tendina__lista" data-render="tendina"></ul>
      <p class="tendina__piede"><span>Non trovi il tuo evento?</span><a class="link-sottile" href="${sez('preventivo')}">Scrivici</a></p>
    </div>
  </nav>
</header>
<nav class="mm" id="menu-telefono" aria-label="Menu" data-mm hidden>
  <ul class="mm__lista">
    <li><button class="mm__a" type="button" aria-expanded="false" aria-controls="mm-eventi" data-acc>Eventi<span class="mm__piu" aria-hidden="true"></span></button>
      <ul class="mm__sub" id="mm-eventi" data-render="mm-eventi" hidden></ul></li>
    <li><a class="mm__a" href="${sez('come-lavoriamo')}">Come lavoriamo</a></li>
    <li><a class="mm__a" href="${sez('galleria')}">Galleria</a></li>
    <li><a class="mm__a" href="${sez('contatti')}">Contatti</a></li>
  </ul>
  <div class="mm__piede">
    <a class="btn btn--chiaro btn--blocco" href="${sez('preventivo')}">Richiedi un preventivo ${I.freccia}</a>
    <p class="mm__contatti"><a data-link="tel" href="tel:${esc(C.telefonoLink)}">Chiama</a><a data-link="wa" href="https://wa.me/${esc(C.whatsapp)}">WhatsApp</a><a data-link="mail" href="mailto:${esc(C.email)}">Email</a></p>
  </div>
</nav>`;
}

function piede({ base, evento }) {
  return `<footer class="pie"${evento ? ' id="contatti"' : ''}>
  <div class="wrap pie__griglia">
    <div>
      <p class="pie__marchio" data-t="nome">${t('nome')}</p>
      <p class="pie__sotto" data-t="sottotitolo">${t('sottotitolo')}</p>
      <p class="pie__frase" data-t="descrizione">${t('descrizione')}</p>
    </div>
    <div>
      <h3>Contatti</h3>
      <ul class="pie__lista">
        <li><a data-link="tel" href="tel:${esc(C.telefonoLink)}" data-t="contatti.telefono">${t('contatti.telefono')}</a></li>
        <li><a data-link="wa" href="https://wa.me/${esc(C.whatsapp)}">WhatsApp</a></li>
        <li><a data-link="mail" href="mailto:${esc(C.email)}" data-t="contatti.email">${t('contatti.email')}</a></li>
        <li data-indirizzo>${esc(indirizzo)}</li>
        <li><span class="stato-orari" data-stato></span></li>
      </ul>
    </div>
    <div>
      <h3>Eventi</h3>
      <ul class="pie__lista" data-render="pie-eventi">${S.eventi.map(e => `<li><a href="${base}eventi/${e.pagina}.html">${esc(e.nome)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Seguici</h3>
      <ul class="pie__lista">
        <li><a data-link="instagram" href="${esc(S.social.instagram)}">Instagram</a></li>
        <li><a data-link="facebook" href="${esc(S.social.facebook)}">Facebook</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap pie__legale">
    <p>© <span data-anno>2026</span> <span data-t="legale.ragioneSociale">${t('legale.ragioneSociale')}</span> · P.IVA <span data-t="legale.piva">${t('legale.piva')}</span> · Sede legale: <span data-t="legale.sedeLegale">${t('legale.sedeLegale')}</span></p>
    <p><a href="${base}privacy.html">Privacy e cookie</a></p>
  </div>
  <div class="pie__gigante" aria-hidden="true"><p class="giant" data-giant="nome" data-max="9"><span class="giant__parola" style="--fit-k:${fitK(S.nome)}">${esc(S.nome)}</span></p></div>
</footer>
<nav class="mbar" aria-label="Contatti rapidi" data-mbar>
  <a data-link="tel" href="tel:${esc(C.telefonoLink)}">${I.tel}Chiama</a>
  <a data-link="wa" href="https://wa.me/${esc(C.whatsapp)}">${I.wa}WhatsApp</a>
</nav>
</body>
</html>
`;
}

function preventivo({ base, titolo, testo }) {
  return `<section class="preventivo sez" id="preventivo">
  <div class="wrap prev__griglia">
    <div class="prev__testa">
      <p class="etichetta">Preventivo</p>
      <h2 class="titolo" data-titolo data-h="${titolo}">${h(titolo)}</h2>
      <p class="testo-lead" data-t="${testo}">${t(testo)}</p>
      <div class="prev__alt">
        <a class="btn btn--linea" data-wa-modulo href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">${I.wa}Scrivici su WhatsApp</a>
        <p>Oppure chiama il <a data-link="tel" href="tel:${esc(C.telefonoLink)}" data-t="contatti.telefono">${t('contatti.telefono')}</a></p>
      </div>
    </div>
    <form class="modulo" data-modulo novalidate>
      <div class="campo"><label for="f-nome">Nome e cognome</label><input id="f-nome" name="nome" autocomplete="name" required aria-describedby="e-nome"><p class="campo__errore" id="e-nome" hidden></p></div>
      <div class="campo"><label for="f-tel">Telefono</label><input id="f-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="e-tel"><p class="campo__errore" id="e-tel" hidden></p></div>
      <div class="campo"><label for="f-email">Email <span>(facoltativa)</span></label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" aria-describedby="e-email"><p class="campo__errore" id="e-email" hidden></p></div>
      <div class="campo"><label for="f-tipo">Tipo di evento</label><select id="f-tipo" name="tipo" required aria-describedby="e-tipo"><option value="">Scegli il tipo di evento</option>${S.eventi.map(e => `<option>${esc(e.nome)}</option>`).join('')}<option>Altro</option></select><p class="campo__errore" id="e-tipo" hidden></p></div>
      <div class="campo"><label for="f-data">Data dell'evento</label><input id="f-data" name="data" type="date" required aria-describedby="e-data"><p class="campo__errore" id="e-data" hidden></p></div>
      <div class="campo"><label for="f-ospiti">Numero di ospiti <span>(circa)</span></label><input id="f-ospiti" name="ospiti" type="number" min="1" step="1" inputmode="numeric" aria-describedby="e-ospiti"><p class="campo__errore" id="e-ospiti" hidden></p></div>
      <div class="campo campo--largo"><label for="f-luogo">Luogo <span>(facoltativo)</span></label><input id="f-luogo" name="luogo" autocomplete="off" placeholder="Villa, sala, giardino di casa, comune…"></div>
      <div class="campo campo--largo"><label for="f-msg">Messaggio <span>(facoltativo)</span></label><textarea id="f-msg" name="messaggio" rows="4" placeholder="Raccontaci la festa che hai in mente"></textarea></div>
      <label class="trappola" aria-hidden="true">Non compilare questo campo<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label>
      <p class="modulo__stato" data-stato-modulo role="status" aria-live="polite" hidden></p>
      <div class="modulo__invia">
        <button class="btn" type="submit">Invia la richiesta ${I.freccia}</button>
        <p class="modulo__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="${base}privacy.html">Leggi l'informativa privacy</a></p>
      </div>
    </form>
  </div>
</section>`;
}

const strisce = (et, tit) => `<section class="galleria sez" id="galleria">
    <div class="wrap galleria__testa">
      <p class="etichetta">${et}</p>
      <h2 class="titolo" data-titolo data-h="${tit}">${h(tit)}</h2>
    </div>
    <div class="strisce" data-render="strisce" role="region" aria-label="Galleria fotografica: tocca una foto per ingrandirla"></div>
  </section>`;

const passi = ({ chiari, et, tit, testo }) => `<section class="passi${chiari ? ' passi--chiari' : ''} sez" id="come-lavoriamo">
    <div class="wrap passi__griglia">
      <div class="passi__testa">
        <p class="etichetta">${et}</p>
        <h2 class="titolo" data-titolo data-h="${tit}">${h(tit)}</h2>
        ${testo ? `<p class="testo-lead" data-rivela data-t="${testo}">${t(testo)}</p>` : ''}
      </div>
      <div class="passi__corpo"><span class="passi__linea" aria-hidden="true"><span class="passi__linea-in"></span></span><ol class="passi__lista" data-render="passi"></ol></div>
    </div>
  </section>`;

/* ---------------- HOME ---------------- */
function paginaHome() {
  const base = '';
  const hc = [1280, 1920, 2560].map(w => `assets/img/home/hero-computer-${w}.webp ${w}w`).join(', ');
  const ht = [640, 1280, 1920].map(w => `assets/img/home/hero-telefono-${w}.webp ${w}w`).join(', ');
  const MQ = '(max-width: 767px), (orientation: portrait)';
  const extra = `<link rel="preload" as="image" imagesrcset="${ht}" imagesizes="100vw" media="${MQ}" fetchpriority="high">
<link rel="preload" as="image" imagesrcset="${hc}" imagesizes="100vw" media="(min-width: 768px) and (orientation: landscape)" fetchpriority="high">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FoodEstablishment', name: `${S.nome} · ${S.sottotitolo}`,
    description: S.descrizione, url: URL_SITO, telephone: C.telefonoLink, email: C.email,
    address: { '@type': 'PostalAddress', streetAddress: C.indirizzo, postalCode: C.cap, addressLocality: C.citta, addressRegion: C.provincia, addressCountry: 'IT' },
    areaServed: S.zona.luoghi, image: `${URL_SITO}assets/og/home.jpg`,
  })}</script>
`;
  return `${testa({ titolo: S.home.meta.titolo, descrizione: S.home.meta.descrizione, base, og: 'home', percorso: '', extra })}
<body class="pagina-home" data-pagina="home">
${intestazione({ base, home: true })}
<main id="contenuto">
  <section class="hero hero--alto" data-hero aria-label="${esc(S.nome)}, ${esc(S.sottotitolo)}" style="--op-pc: 50% 72%; --op-tel: 50% 58%">
    <div class="hero__media"><div class="hero__scala">
      <picture>
        <source media="${MQ}" srcset="${ht}" sizes="100vw">
        <img src="assets/img/home/hero-computer-1920.webp" srcset="${hc}" sizes="100vw" width="2560" height="1451" alt="Lunga tavola apparecchiata in un giardino, con candele e fiori rosa sotto grandi alberi" fetchpriority="high" decoding="async">
      </picture>
    </div></div>
    <div class="hero__ombra" aria-hidden="true"></div>
    <div class="hero__nome">
      <h1 class="giant" data-giant="nome"><span class="sr-only">${esc(S.nome)} · ${esc(S.sottotitolo)} a ${esc(C.citta)}</span><span class="giant__parola" style="--fit-k:${fitK(S.nome)}">${esc(S.nome)}</span></h1>
    </div>
    <div class="hero__basso wrap">
      <div class="hero__testo">
        <div>
          <p class="etichetta" data-entra><span><span data-t="sottotitolo">${t('sottotitolo')}</span><span class="hero__citta">&nbsp;·&nbsp;<span data-t="contatti.citta">${t('contatti.citta')}</span></span></span></p>
          <p class="hero__sub" data-entra data-t="home.heroSottotitolo" style="margin-top:12px">${t('home.heroSottotitolo')}</p>
        </div>
        <a class="btn btn--chiaro" href="#preventivo" data-entra>Richiedi un preventivo ${I.freccia}</a>
      </div>
      <a class="hero__scorri" href="#intro" data-entra>Scorri<i aria-hidden="true"></i></a>
    </div>
  </section>

  <section class="intro sez" id="intro">
    <div class="wrap intro__griglia">
      <div>
        <p class="etichetta" data-t="home.intro.etichetta">${t('home.intro.etichetta')}</p>
        <p class="intro__frase" data-frase data-h="home.intro.frase">${h('home.intro.frase')}</p>
        <p class="intro__p" data-rivela data-t="home.intro.testo">${t('home.intro.testo')}</p>
        <div class="intro__azioni" data-rivela><a class="btn" href="#eventi">Scopri gli eventi ${I.freccia}</a><a class="link-sottile" href="#come-lavoriamo">Come lavoriamo</a></div>
      </div>
      <figure class="intro__foto foto-tenda" data-tenda data-render="intro-foto"></figure>
    </div>
  </section>

  <section class="eventi sez" id="eventi" style="padding-top:0">
    <div class="wrap">
      <div class="eventi__testa">
        <div><p class="etichetta" data-t="home.eventi.etichetta">${t('home.eventi.etichetta')}</p><h2 class="titolo" data-titolo data-h="home.eventi.titolo">${h('home.eventi.titolo')}</h2></div>
        <p class="testo-lead" data-rivela data-t="home.eventi.testo">${t('home.eventi.testo')}</p>
      </div>
      <ul class="carosello carosello--eventi" data-render="card-eventi"></ul>
      <p class="carosello__aiuto" aria-hidden="true"><i></i>Scorri per vedere tutti gli eventi</p>
    </div>
  </section>

  <div class="scuro" data-scuro>
  ${passi({ et: 'Come lavoriamo', tit: 'home.passi.titolo', testo: 'home.passi.testo' })}
  ${strisce('Galleria', 'home.galleria.titolo')}
  </div>

  <section class="recensioni sez">
    <div class="wrap">
      <div class="rec__testa">
        <h2 class="titolo titolo--m" data-titolo data-t="home.recensioni.titolo" style="margin-top:0">${t('home.recensioni.titolo')}</h2>
        <p class="rec__nota" data-t="home.recensioni.nota">${t('home.recensioni.nota')}</p>
      </div>
      <ul class="carosello rec__lista" data-render="recensioni"></ul>
    </div>
  </section>

  ${preventivo({ base, titolo: 'home.preventivo.titolo', testo: 'home.preventivo.testo' })}

  <section class="contatti sez" id="contatti">
    <div class="wrap cont__griglia">
      <div>
        <p class="etichetta" data-t="home.contatti.etichetta">${t('home.contatti.etichetta')}</p>
        <h2 class="titolo" data-titolo data-h="home.contatti.titolo">${h('home.contatti.titolo')}</h2>
        <p class="testo-lead" data-t="home.contatti.testo">${t('home.contatti.testo')}</p>
        <dl class="cont__dati">
          <div class="cont__riga"><dt>Telefono</dt><dd><a data-link="tel" href="tel:${esc(C.telefonoLink)}" data-t="contatti.telefono">${t('contatti.telefono')}</a><br><span class="stato-orari" data-stato></span></dd></div>
          <div class="cont__riga"><dt>WhatsApp</dt><dd><a data-link="wa" href="https://wa.me/${esc(C.whatsapp)}">Scrivici un messaggio</a></dd></div>
          <div class="cont__riga"><dt>Email</dt><dd><a data-link="mail" href="mailto:${esc(C.email)}" data-t="contatti.email">${t('contatti.email')}</a></dd></div>
          <div class="cont__riga"><dt>Indirizzo</dt><dd><a data-link="maps" href="#" data-indirizzo>${esc(indirizzo)}</a></dd></div>
          <div class="cont__riga"><dt>Zona servita</dt><dd data-t="zona.testo">${t('zona.testo')}</dd></div>
          <div class="cont__riga"><dt>Orari</dt><dd data-t="orari.testo">${t('orari.testo')}</dd></div>
        </dl>
        <p class="cont__social"><a class="link-sottile" data-link="instagram" href="${esc(S.social.instagram)}">Instagram</a><a class="link-sottile" data-link="facebook" href="${esc(S.social.facebook)}">Facebook</a></p>
      </div>
      <div class="mappa" data-mappa>
        <div class="mappa__box">
          <div class="mappa__sfondo" aria-hidden="true"></div>
          <p class="etichetta">Dove siamo</p>
          <p class="mappa__ind" data-indirizzo>${esc(indirizzo)}</p>
          <div class="mappa__azioni"><button class="btn btn--chiaro" type="button" data-mappa-carica>Mostra la mappa</button><a class="link-sottile" data-link="maps" href="#">Apri in Google Maps</a></div>
          <p class="mappa__nota">Caricando la mappa, Google riceverà alcuni dati di navigazione.</p>
        </div>
      </div>
    </div>
  </section>
</main>
${piede({ base })}`;
}

/* ---------------- PAGINE EVENTO ---------------- */
function paginaEvento(e, n) {
  const base = '../';
  const k = e.chiave;
  const P = `eventi.${n}`;
  const MQ = '(max-width: 767px), (orientation: portrait)';
  // hero con foto (heroFoto in config.js) o con video
  const F = e.heroFoto;
  const pv = F ? [720, 1080, 1440].map(w => `../assets/img/${k}/hero-telefono-${w}.webp ${w}w`).join(', ')
    : `../assets/video/${k}-verticale-720.webp 720w, ../assets/video/${k}-verticale-1080.webp 1080w`;
  const po = F ? [1280, 1920, 2560].map(w => `../assets/img/${k}/hero-computer-${w}.webp ${w}w`).join(', ')
    : `../assets/video/${k}-orizzontale-1280.webp 1280w, ../assets/video/${k}-orizzontale-1920.webp 1920w`;
  const media = F
    ? `<picture>
        <source media="${MQ}" srcset="${pv}" sizes="100vw">
        <img class="hero__foto respira" src="../assets/img/${k}/hero-computer-1920.webp" srcset="${po}" sizes="100vw" width="${F.w}" height="${F.h}" alt="${esc(F.alt)}" fetchpriority="high" decoding="async">
      </picture>`
    : `<picture>
        <source media="${MQ}" srcset="${pv}" sizes="100vw">
        <img src="../assets/video/${k}-orizzontale-1920.webp" srcset="${po}" sizes="100vw" width="1920" height="1080" alt="" fetchpriority="high" decoding="async">
      </picture>
      <video data-video-hero data-src-pc="../assets/video/${k}-orizzontale.mp4" data-src-tel="../assets/video/${k}-verticale.mp4" muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"></video>`;
  const stileFoto = F ? ` style="--op-pc:${F.posPc};--op-tel:${F.posTel}"` : '';
  const extra = `<link rel="preload" as="image" imagesrcset="${pv}" imagesizes="100vw" media="${MQ}" fetchpriority="high">
<link rel="preload" as="image" imagesrcset="${po}" imagesizes="100vw" media="(min-width: 768px) and (orientation: landscape)" fetchpriority="high">
`;
  return `${testa({ titolo: e.meta.titolo, descrizione: e.meta.descrizione, base, og: k, percorso: `eventi/${e.pagina}.html`, extra })}
<body class="pagina-evento" data-pagina="evento" data-evento="${k}">
${intestazione({ base, evento: true })}
<main id="contenuto">
  <section class="hero hero--evento hero--${e.posizioneTitolo}${F ? ' hero--foto' : ''}" data-hero aria-label="${esc(e.nome)}"${stileFoto}>
    <div class="hero__media"><div class="hero__scala">
      ${media}
    </div></div>
    <div class="hero__ombra" aria-hidden="true"></div>
    <div class="hero__nome">
      <p class="etichetta hero__sopra" data-entra data-ev="sopratitolo">${esc(e.sopratitolo)}</p>
      <h1 class="giant" data-giant="evento"><span class="sr-only">${esc(e.nome)} · ${esc(S.nome)} ${esc(S.sottotitolo)}</span><span class="giant__parola" style="--fit-k:${fitK(e.titolo)}">${esc(e.titolo)}</span></h1>
    </div>
    <div class="hero__basso wrap">
      <div class="hero__testo">
        <p class="hero__sub" data-entra data-ev="heroSottotitolo">${esc(e.heroSottotitolo)}</p>
        <a class="btn btn--chiaro" href="#preventivo" data-entra>Richiedi un preventivo ${I.freccia}</a>
      </div>
      <a class="hero__scorri" href="#intro" data-entra>Scorri<i aria-hidden="true"></i></a>
    </div>
  </section>

  <section class="intro sez" id="intro">
    <div class="wrap intro__griglia">
      <div>
        <p class="etichetta" data-t="${P}.nome">${esc(e.nome)}</p>
        <p class="intro__frase" data-frase data-h="${P}.intro.frase">${h(`${P}.intro.frase`)}</p>
        <p class="intro__p" data-rivela data-t="${P}.intro.testo">${t(`${P}.intro.testo`)}</p>
        <div class="intro__azioni" data-rivela><a class="btn" href="#preventivo">Richiedi un preventivo ${I.freccia}</a><a class="link-sottile" href="#proposta">Guarda la proposta di esempio</a></div>
      </div>
      <figure class="intro__foto foto-tenda" data-tenda data-render="intro-foto"></figure>
    </div>
  </section>

  ${passi({ chiari: true, et: 'Come lavoriamo', tit: 'paginaEvento.passiTitolo' })}

  <section class="cura sez" style="background:var(--sabbia)">
    <div class="wrap">
      <p class="etichetta">Su misura</p>
      <h2 class="titolo" data-titolo data-h="paginaEvento.curaTitolo">${h('paginaEvento.curaTitolo')}</h2>
      <p class="testo-lead" data-rivela data-t="paginaEvento.curaTesto">${t('paginaEvento.curaTesto')}</p>
      <ul class="cura__lista" data-render="cura"></ul>
    </div>
  </section>

  <div class="scuro" data-scuro>
    <section class="proposta sez" id="proposta">
      <div class="wrap proposta__griglia">
        <div class="proposta__testa">
          <p class="etichetta" data-t="paginaEvento.propostaEtichetta">${t('paginaEvento.propostaEtichetta')}</p>
          <h2 class="titolo" data-titolo data-h="paginaEvento.propostaTitolo">${h('paginaEvento.propostaTitolo')}</h2>
          <p class="testo-lead" data-rivela>Un esempio di come potrebbe essere il menù. Nessun prezzo: lo costruiamo insieme dopo il primo incontro.</p>
        </div>
        <div class="menu-carta" data-rivela data-render="proposta"></div>
      </div>
    </section>
    ${strisce('Galleria', 'paginaEvento.galleriaTitolo')}
  </div>

  <section class="faq sez">
    <div class="wrap faq__griglia">
      <div><p class="etichetta">Domande</p><h2 class="titolo" data-titolo data-h="paginaEvento.faqTitolo">${h('paginaEvento.faqTitolo')}</h2></div>
      <div class="faq__lista" data-render="faq"></div>
    </div>
  </section>

  ${preventivo({ base, titolo: 'paginaEvento.preventivoTitolo', testo: 'paginaEvento.preventivoTesto' })}

  <section class="altri sez">
    <div class="wrap">
      <p class="etichetta">Eventi</p>
      <h2 class="titolo" data-titolo data-h="paginaEvento.altriTitolo" style="margin-bottom:clamp(36px,5vw,64px)">${h('paginaEvento.altriTitolo')}</h2>
      <ul class="carosello" data-render="altri-eventi"></ul>
      <p class="carosello__aiuto" aria-hidden="true"><i></i>Scorri per vedere gli altri eventi</p>
    </div>
  </section>
</main>
${piede({ base, evento: true })}`;
}

/* ---------------- PRIVACY ---------------- */
function paginaPrivacy() {
  const base = '';
  const d = p => `<span data-t="${p}">${t(p)}</span>`;
  const mail = `<a data-link="mail-privacy" href="mailto:${esc(L.emailPrivacy)}">${d('legale.emailPrivacy')}</a>`;
  const pec = `<a href="mailto:${esc(L.pec)}">${d('legale.pec')}</a>`;
  const tel = `<a data-link="tel" href="tel:${esc(C.telefonoLink)}">${d('contatti.telefono')}</a>`;
  return `${testa({ titolo: `Informativa privacy · ${S.nome} ${S.sottotitolo}`, descrizione: `Come ${S.nome} tratta i dati personali di chi visita il sito o chiede un preventivo.`, base, og: 'home', percorso: 'privacy.html' })}
<body class="pagina-semplice" data-pagina="privacy">
${intestazione({ base })}
<main id="contenuto">
  <div class="wrap">
    <article class="testo-legale">
      <h1>Informativa privacy</h1>
      <p>Come trattiamo i dati personali di chi visita questo sito o ci contatta. Informativa ai sensi degli articoli 13 e 14 del Regolamento UE 2016/679 (GDPR).</p>

      <h2>Chi è il titolare del trattamento</h2>
      <p>Il titolare è chi decide come e perché vengono usati i dati:</p>
      <p><strong>${d('legale.ragioneSociale')}</strong> (${d('nome')} ${d('sottotitolo')})<br>
      P.IVA ${d('legale.piva')} · C.F. ${d('legale.codiceFiscale')}<br>
      Sede legale: ${d('legale.sedeLegale')}<br>
      Email ${mail}<br>
      PEC ${pec}<br>
      Telefono ${tel}</p>

      <h2>Quali dati raccogliamo</h2>
      <p>Raccogliamo solo i dati che servono:</p>
      <ul>
        <li><strong>Dati di navigazione.</strong> Quando visitate il sito, il servizio che lo ospita registra in automatico alcuni dati tecnici: indirizzo IP, tipo di browser e di dispositivo, pagina richiesta, data e ora. Servono a far funzionare il sito e a proteggerlo, non a capire chi siete.</li>
        <li><strong>Dati del modulo.</strong> Solo quelli che scrivete voi nel modulo di richiesta preventivo: nome e cognome, numero di telefono, email (facoltativa), tipo di evento, data, numero indicativo di ospiti, luogo ed eventuale messaggio.</li>
        <li><strong>Dati dei contatti diretti.</strong> Se ci scrivete per email, su WhatsApp o ci telefonate, usiamo i dati che ci comunicate (per esempio nome, numero, indirizzo email e testo del messaggio).</li>
      </ul>
      <p>Vi chiediamo di non inserire nei messaggi dati non necessari, in particolare informazioni sulla salute: se ci sono allergie o intolleranze da gestire, ne parleremo direttamente.</p>

      <h2>Perché usiamo i dati e su quale base</h2>
      <ul>
        <li><strong>Far funzionare il sito e proteggerlo</strong> (dati di navigazione).<br>Base giuridica: nostro legittimo interesse alla sicurezza e al buon funzionamento del sito (articolo 6.1.f del GDPR).</li>
        <li><strong>Rispondere alle vostre richieste</strong> e prepararvi un eventuale preventivo.<br>Base giuridica: misure precontrattuali adottate su vostra richiesta (articolo 6.1.b del GDPR).</li>
        <li><strong>Rispettare gli obblighi di legge</strong>, per esempio fiscali e contabili, se alla richiesta segue un contratto.<br>Base giuridica: obbligo di legge (articolo 6.1.c del GDPR).</li>
      </ul>
      <p>Non vendiamo i dati e non li cediamo ad altri per i loro scopi. Senza i dati necessari (per esempio nome e telefono) non possiamo rispondere alla richiesta.</p>

      <h2>Per quanto tempo conserviamo i dati</h2>
      <ul>
        <li><strong>Dati di navigazione</strong>: per il tempo stabilito dal servizio di hosting per motivi di sicurezza, come indicato nella sua informativa.</li>
        <li><strong>Richieste e messaggi</strong>: per il tempo necessario a rispondere. Se alla richiesta non segue un contratto, li cancelliamo al massimo entro 24 mesi.</li>
        <li><strong>Dati legati a un contratto</strong>: per il tempo richiesto dalla legge (per i documenti fiscali e contabili, di regola 10 anni).</li>
      </ul>

      <h2>Servizi esterni e destinatari</h2>
      <p>I dati sono trattati da noi e dalle persone autorizzate che lavorano con noi. Per far funzionare il sito ci appoggiamo ad alcuni fornitori. Ognuno riceve solo i dati che servono al proprio servizio.</p>
      <ul>
        <li><strong>GitHub Pages</strong> (GitHub, Inc.): è il servizio che ospita il sito. Come ogni server web, registra dati tecnici delle visite (indirizzo IP, browser, pagina richiesta) per sicurezza e funzionamento. <a href="https://docs.github.com/it/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Informativa di GitHub</a>.</li>
        <li><strong>Web3Forms</strong>: invia per email a noi i dati che scrivete nel modulo. Riceve quindi i dati del modulo e alcuni dati tecnici dell'invio (come l'indirizzo IP). <a href="https://web3forms.com/privacy" target="_blank" rel="noopener">Informativa di Web3Forms</a>.</li>
        <li><strong>Google Maps</strong>: la mappa si carica <em>solo se premete</em> il pulsante "Mostra la mappa". Da quel momento Google riceve dati di navigazione (come l'indirizzo IP) e può usare propri cookie. Lo stesso vale se aprite il link "Apri in Google Maps". <a href="https://policies.google.com/privacy?hl=it" target="_blank" rel="noopener">Informativa di Google</a>.</li>
        <li><strong>WhatsApp</strong>: solo se scegliete di scriverci premendo un pulsante WhatsApp. In quel caso la conversazione passa attraverso WhatsApp, che ne tratta i dati secondo la propria informativa. <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener">Informativa di WhatsApp</a>.</li>
      </ul>
      <p>I link ai nostri profili social sono semplici collegamenti: i social ricevono dati solo se li aprite.</p>
      <p>Quando serve, i dati possono essere comunicati anche ai consulenti che ci assistono (per esempio il commercialista, per gli obblighi fiscali) e alle autorità, se lo prevede la legge.</p>

      <h2>Trasferimento dei dati fuori dall'Unione Europea</h2>
      <p>Alcuni dei fornitori elencati sopra hanno sede o server negli Stati Uniti o in altri Paesi fuori dall'UE. In questi casi i dati vengono trasferiti solo con le garanzie previste dal GDPR: per esempio una decisione di adeguatezza della Commissione europea (come il Data Privacy Framework UE-USA, per i fornitori che vi aderiscono) oppure le clausole contrattuali standard approvate dalla Commissione europea. I dettagli sono nelle informative dei singoli fornitori; potete anche chiederli a noi.</p>

      <h2>Cookie</h2>
      <p>Questo sito <strong>non usa cookie</strong>: né di profilazione, né di statistica, né tecnici.</p>
      <p>I caratteri tipografici sono caricati dal nostro sito, senza collegamenti a Google Fonts, e non ci sono video incorporati da altri servizi, pixel, pubblicità o strumenti di statistica. Per questo non trovate un banner dei cookie.</p>
      <p>Solo se attivate la mappa di Google Maps, Google può impostare propri cookie, secondo la sua informativa.</p>

      <h2>I vostri diritti e il reclamo al Garante Privacy</h2>
      <p>In ogni momento potete chiedere di:</p>
      <ul>
        <li><strong>accedere</strong> ai vostri dati e sapere come li usiamo;</li>
        <li><strong>rettificarli</strong> se sono sbagliati o incompleti;</li>
        <li><strong>cancellarli</strong>;</li>
        <li><strong>limitarne</strong> l'uso o <strong>opporvi</strong> al trattamento, in particolare quando si basa sul nostro legittimo interesse;</li>
        <li>riceverli in un formato di uso comune (<strong>portabilità</strong>).</li>
      </ul>
      <p><strong>Come fare:</strong> scrivete a ${mail} (oppure via PEC a ${pec}) o chiamate il ${tel}. Vi risponderemo entro un mese.</p>
      <p>Se ritenete che i vostri dati siano trattati in modo non corretto, potete presentare <strong>reclamo al Garante per la protezione dei dati personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).</p>

      <h2>Modifiche a questa informativa</h2>
      <p>Possiamo aggiornare questa informativa, per esempio se aggiungiamo un servizio al sito o se cambia la normativa. La versione valida è sempre quella pubblicata in questa pagina, con la data di ultimo aggiornamento qui sotto.</p>
      <p class="aggiornato"><strong>Ultimo aggiornamento:</strong> ${d('legale.aggiornamentoPrivacy')}</p>
      <p style="margin-top:40px"><a class="btn" href="index.html" style="color:var(--avorio)">Torna al sito ${I.freccia}</a></p>
    </article>
  </div>
  <div style="height:clamp(80px,10vw,140px)"></div>
</main>
${piede({ base })}`;
}

/* ---------------- 404 ---------------- */
function pagina404() {
  // percorsi assoluti dalla radice del progetto, perché la 404 può apparire in qualsiasi cartella
  const base = new URL(URL_SITO).pathname;
  return `${testa({ titolo: `Pagina non trovata · ${S.nome}`, descrizione: 'La pagina che cerchi non esiste o è stata spostata.', base, og: 'home', percorso: '404.html' })}
<body class="pagina-semplice" data-pagina="errore">
${intestazione({ base })}
<main id="contenuto">
  <div class="wrap errore404">
    <p class="etichetta">Errore 404</p>
    <h1>Questa pagina non c'è.</h1>
    <p class="testo-lead">Forse il link è sbagliato o la pagina è stata spostata. Torna alla pagina principale o scegli un evento.</p>
    <p><a class="btn" href="${base}index.html">Torna alla home ${I.freccia}</a></p>
  </div>
</main>
${piede({ base })}`;
}

/* ---------------- scrittura ---------------- */
mkdirSync(join(ROOT, 'eventi'), { recursive: true });
const scrivi = (f, s) => { writeFileSync(join(ROOT, f), s); console.log('scritto', f); };
scrivi('index.html', paginaHome());
S.eventi.forEach((e, n) => scrivi(`eventi/${e.pagina}.html`, paginaEvento(e, n)));
scrivi('privacy.html', paginaPrivacy());
scrivi('404.html', pagina404());
