/* =====================================================================
   Zeta Catering — main.js
   Testi e dati arrivano da config.js (window.SITO).
   Animazioni con GSAP + ScrollTrigger + SplitText (in js/vendor, locali).
   Regole: solo transform / opacity / clip-path, nessuno scroll-jacking,
   ricalcoli solo quando cambia la LARGHEZZA della finestra.
   ===================================================================== */
(() => {
  'use strict';

  const S = window.SITO || {};
  const D = document, H = D.documentElement, B = D.body;
  const $ = (s, r = D) => r.querySelector(s);
  const $$ = (s, r = D) => [...r.querySelectorAll(s)];
  const BASE = H.dataset.base || '';
  const CHIAVE = B.dataset.evento || '';
  const RIDOTTO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MQ_TEL = matchMedia('(max-width: 767px), (orientation: portrait)');
  const PUNTATORE = matchMedia('(hover: hover) and (pointer: fine)');
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;
  const ANIM = !RIDOTTO && !!(gsap && ScrollTrigger);
  if (!ANIM) H.classList.add('no-anim');
  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);
    // niente ricalcoli quando si apre la tastiera o cambia la barra del browser
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  }

  /* ---------- Utilità ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const enfasi = s => esc(s).replace(/\*(.+?)\*([,.;:!?]+)/g, '*$1$2*').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const prendi = p => p.split('.').reduce((o, k) => (o == null ? o : o[k]), S);
  const due = n => String(n).padStart(2, '0');
  const C = S.contatti || {};
  const EVENTI = S.eventi || [];
  const EVENTO = EVENTI.find(e => e.chiave === CHIAVE) || null;
  const LARGHEZZE = [640, 1280, 1920, 2560];
  const ICONA = {
    freccia: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h13M9.5 3.5 14 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    sx: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 2.5 5 8l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    dx: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 2.5 11 8l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  };

  // Ricalcoli SOLO quando cambia la larghezza (non con tastiera o barra del browser)
  const allaLarghezza = [];
  let ultimaL = innerWidth, timerL = 0;
  addEventListener('resize', () => {
    if (innerWidth === ultimaL) return;
    ultimaL = innerWidth;
    clearTimeout(timerL);
    timerL = setTimeout(() => {
      allaLarghezza.forEach(f => f());
      if (ANIM) ScrollTrigger.refresh();
    }, 160);
  });

  /* ---------- Foto ---------- */
  const fotoDi = (gruppo, nome) => (S.foto?.[gruppo] || []).find(f => f[0] === nome);
  const larghezzeDi = w => LARGHEZZE.filter(x => x <= w);
  const srcset = (g, [f, w]) => larghezzeDi(w).map(x => `${BASE}assets/img/${g}/${f}-${x}.webp ${x}w`).join(', ');
  const src = (g, [f, w], pref = 1280) => { const ws = larghezzeDi(w); return `${BASE}assets/img/${g}/${f}-${ws.includes(pref) ? pref : ws[ws.length - 1]}.webp`; };
  function img(g, foto, { sizes = '100vw', cls = '', pref = 1280, lazy = true, stile = '' } = {}) {
    const [, w, h, alt] = foto;
    return `<img${cls ? ` class="${cls}"` : ''} src="${src(g, foto, pref)}" srcset="${srcset(g, foto)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async" draggable="false"${stile ? ` style="${stile}"` : ''}>`;
  }

  /* ---------- Collegamenti ---------- */
  const indirizzo = () => `${C.indirizzo}, ${C.cap} ${C.citta} (${C.provincia})`;
  const hrefEvento = e => `${BASE}eventi/${e.pagina}.html`;
  function testoWa(tipo, data, ospiti) {
    let t = S.whatsappMessaggio || 'Ciao! Vorrei un preventivo.';
    const ev = tipo || EVENTO?.nome;
    if (ev) t += `\nTipo di evento: ${ev}`;
    if (data) t += `\nData: ${data.split('-').reverse().join('/')}`;
    if (ospiti) t += `\nOspiti: circa ${ospiti}`;
    return t;
  }
  const linkWa = (...a) => `https://wa.me/${C.whatsapp || ''}?text=${encodeURIComponent(testoWa(...a))}`;

  /* =====================================================================
     1. TESTI E DATI DA config.js
     ===================================================================== */
  const NOMI_SOCIAL = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' };
  function riempi() {
    $$('[data-t]').forEach(el => { const v = prendi(el.dataset.t); if (v != null) el.textContent = v; });
    $$('[data-h]').forEach(el => { const v = prendi(el.dataset.h); if (v != null) el.innerHTML = enfasi(v); });
    $$('[data-ev]').forEach(el => { const v = EVENTO?.[el.dataset.ev]; if (v != null) el.innerHTML = enfasi(v); });
    $$('[data-indirizzo]').forEach(el => { el.textContent = indirizzo(); });
    $$('[data-anno]').forEach(el => { el.textContent = new Date().getFullYear(); });
    $$('[data-link]').forEach(a => {
      const t = a.dataset.link;
      // social: link veri da config.js; se il link è vuoto il pulsante non compare
      if (NOMI_SOCIAL[t]) {
        const url = S.social?.[t];
        const box = /^(P|LI)$/.test(a.parentElement.tagName) && a.parentElement.children.length === 1 ? a.parentElement : a;
        box.hidden = !url;
        if (!url) { a.removeAttribute('href'); return; }
        a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', `${S.nome || ''} su ${NOMI_SOCIAL[t]}`);
        return;
      }
      if (t === 'tel') a.href = `tel:${C.telefonoLink || ''}`;
      else if (t === 'mail') a.href = `mailto:${C.email || ''}`;
      else if (t === 'mail-privacy') a.href = `mailto:${S.legale?.emailPrivacy || ''}`;
      else if (t === 'wa') a.href = linkWa();
      else if (t === 'maps') a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo())}`;
      else if (S.social?.[t]) a.href = S.social[t];
      if (!/^(tel|mail)/.test(t)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }

  /* =====================================================================
     2. CONTENUTI RIPETUTI (liste, card, strisce…)
     ===================================================================== */
  const mini = e => `${BASE}assets/img/eventi/${e.chiave}-mini-200.webp`;
  // video dell'anteprima: vuoto finché non serve (preload none, src in data-src); con "riduci movimento" non c'è
  const videoCard = e => (RIDOTTO || e.heroFoto ? '' : `<video class="card__video" data-src="${BASE}assets/video/${e.chiave}-anteprima.mp4" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1"></video>`);
  const card = (e, i) => `
    <li class="card" data-card><a class="card__a" href="${hrefEvento(e)}">
      <div class="card__media"><div class="card__zoom" style="position:absolute;inset:0">
        <img class="card__img${e.heroFoto ? ' respira' : ''}" src="${BASE}assets/img/eventi/${e.chiave}-card-480.webp" srcset="${BASE}assets/img/eventi/${e.chiave}-card-480.webp 480w, ${BASE}assets/img/eventi/${e.chiave}-card-720.webp 720w" sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 78vw" width="720" height="900" alt="" loading="lazy" decoding="async">${videoCard(e)}
      </div></div>
      <div class="card__testo"><span class="card__n">${due(i + 1)}</span><h3 class="card__nome">${esc(e.nome)}</h3><p class="card__desc">${esc(e.breve)}</p><span class="card__vai">Scopri ${ICONA.freccia}</span></div>
    </a></li>`;

  function rendi() {
    const r = n => $(`[data-render="${n}"]`);
    let el;
    if ((el = r('tendina'))) el.innerHTML = EVENTI.map(e => `<li><a class="tendina__a" href="${hrefEvento(e)}"${e.chiave === CHIAVE ? ' aria-current="page"' : ''}><img class="tendina__img" src="${mini(e)}" width="200" height="250" alt="" loading="lazy" decoding="async"><span><span class="tendina__nome">${esc(e.nome)}</span><span class="tendina__desc">${esc(e.breve)}</span></span></a></li>`).join('');
    if ((el = r('mm-eventi'))) el.innerHTML = EVENTI.map(e => `<li><a href="${hrefEvento(e)}"><img src="${mini(e)}" width="200" height="250" alt="" loading="lazy" decoding="async"><span><strong>${esc(e.nome)}</strong><span>${esc(e.breve)}</span></span></a></li>`).join('');
    if ((el = r('pie-eventi'))) el.innerHTML = EVENTI.map(e => `<li><a href="${hrefEvento(e)}">${esc(e.nome)}</a></li>`).join('');
    if ((el = r('card-eventi'))) el.innerHTML = EVENTI.map(card).join('');
    if ((el = r('altri-eventi'))) el.innerHTML = EVENTI.filter(e => e.chiave !== CHIAVE).map(card).join('');

    // introduzione (home o evento)
    if ((el = r('intro-foto'))) {
      const g = EVENTO ? EVENTO.chiave : 'home';
      const f = fotoDi(g, EVENTO ? EVENTO.intro.foto : S.home?.intro?.foto);
      if (f) el.innerHTML = img(g, f, { sizes: '(min-width: 900px) 40vw, 92vw', pref: 1280 });
    }

    // passi
    if ((el = r('passi'))) {
      const lista = EVENTO ? EVENTO.passi : S.home?.passi?.lista || [];
      el.innerHTML = lista.map(([t, p], i) => `<li class="passo"><span class="passo__n">${due(i + 1)}</span><h3 class="passo__t">${esc(t)}</h3><p class="passo__p">${esc(p)}</p></li>`).join('');
    }

    // recensioni di esempio
    if ((el = r('recensioni'))) el.innerHTML = (S.home?.recensioni?.lista || []).map(([q, chi, ev]) => `<li><figure class="rec"><blockquote class="rec__q"><p>“${esc(q)}”</p></blockquote><figcaption class="rec__chi"><strong>${esc(chi)}</strong> · ${esc(ev)}</figcaption></figure></li>`).join('');

    // cosa possiamo curare
    if ((el = r('cura')) && EVENTO) el.innerHTML = EVENTO.cura.map(([t, p], i) => `<li class="cura__i" data-rivela><span class="cura__n">${due(i + 1)}</span><h3 class="cura__t">${esc(t)}</h3><p class="cura__p">${esc(p)}</p></li>`).join('');

    // domande frequenti
    if ((el = r('faq')) && EVENTO) el.innerHTML = EVENTO.faq.map(([q, a]) => `<details class="faq__i"><summary class="faq__q">${esc(q)}<span class="mm__piu" aria-hidden="true"></span></summary><p class="faq__r">${esc(a)}</p></details>`).join('');

    // zona servita
    if ((el = r('zona'))) el.textContent = S.zona?.testo || '';

    // strisce di foto
    if ((el = r('strisce'))) {
      const g = EVENTO ? EVENTO.chiave : 'home';
      const escludi = EVENTO ? EVENTO.intro.foto : S.home?.intro?.foto;
      const lista = (S.foto?.[g] || []).filter(f => f[0] !== escludi);
      el.dataset.gruppo = g;
      el._foto = lista;
      const righe = [[], []];
      lista.forEach((f, i) => righe[i % 2].push([f, i]));
      const alt = [[230, 400], [180, 310]]; // altezze telefono / computer (come nel CSS)
      el.innerHTML = righe.map((riga, ri) => `
        <div class="striscia striscia--${ri ? 'b' : 'a'}" data-dir="${ri ? 1 : -1}">
          <div class="striscia__vista"><div class="striscia__in"><ul class="striscia__traccia">
            ${riga.map(([f, i]) => {
              const k = f[1] / f[2];
              const sizes = `(max-width: 767px) ${Math.round(alt[ri][0] * k)}px, ${Math.round(alt[ri][1] * k)}px`;
              return `<li class="striscia__item"><button class="striscia__btn" type="button" data-lb="${i}" aria-label="Apri la foto: ${esc(f[3])}">${img(g, f, { sizes, pref: 640, stile: `--r-img:${f[1]}/${f[2]}` })}</button></li>`;
            }).join('')}
          </ul></div></div>
          <button class="striscia__freccia striscia__freccia--prev" type="button" aria-label="Foto precedenti">${ICONA.sx}</button>
          <button class="striscia__freccia striscia__freccia--next" type="button" aria-label="Foto successive">${ICONA.dx}</button>
        </div>`).join('');
    }
  }

  /* =====================================================================
     3. NOME GIGANTE DA BORDO A BORDO
     Misura i bordi reali dell'inchiostro della prima e dell'ultima lettera
     e porta il nome a toccare i margini, uguali a destra e a sinistra.
     ===================================================================== */
  const tela = D.createElement('canvas').getContext('2d');
  function preparaGiganti() {
    $$('[data-giant]').forEach(g => {
      const tipo = g.dataset.giant;
      // hero della home: il nome intero su una riga · footer: solo il marchio
      const testo = tipo === 'evento' ? EVENTO?.titolo : tipo === 'marchio' ? (S.marchio || S.nome) : (S.nomeHero || S.nome);
      const p = $('.giant__parola', g);
      if (!p || !testo) return;
      p.innerHTML = [...testo].map(c => `<span class="ch"><span class="ch__in">${c === ' ' ? '&nbsp;' : esc(c)}</span></span>`).join('');
      p.setAttribute('aria-hidden', 'true');
    });
  }
  function adatta(g) {
    const p = $('.giant__parola', g);
    const lettere = p ? $$('.ch', p) : [];
    if (!lettere.length) return;
    const cont = g.parentElement;
    const cs = getComputedStyle(cont);
    const disp = cont.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const st = getComputedStyle(p);
    const misura = fs => {
      p.style.fontSize = fs + 'px';
      tela.font = `${st.fontStyle} ${st.fontWeight} ${fs}px ${st.fontFamily}`;
      // crenatura tra le coppie di lettere (le lettere separate la perderebbero)
      lettere.forEach((l, i) => {
        const a = l.textContent, b = lettere[i + 1]?.textContent;
        l.style.marginRight = b ? ((tela.measureText(a + b).width - tela.measureText(a).width - tela.measureText(b).width) / fs).toFixed(4) + 'em' : '';
      });
      const pr = lettere[0], ul = lettere[lettere.length - 1];
      const sx = pr.offsetLeft - tela.measureText(pr.textContent).actualBoundingBoxLeft;
      const dx = ul.offsetLeft + tela.measureText(ul.textContent).actualBoundingBoxRight;
      return { sx, w: dx - sx };
    };
    let fs = 100, m = misura(fs);
    fs = fs * disp / m.w; m = misura(fs);          // seconda passata: la dimensione ottica cambia le larghezze
    fs = fs * disp / m.w;
    fs = Math.min(fs, innerHeight * (g.dataset.max ? +g.dataset.max : 0.42));
    m = misura(fs);
    const sposta = -m.sx + Math.max(0, (disp - m.w) / 2);
    p.style.setProperty('--sposta', sposta.toFixed(2) + 'px');
    g.style.setProperty('--fit-px', fs.toFixed(1) + 'px');
    g.parentElement.style.setProperty('--fit-px', fs.toFixed(1) + 'px');
    g.classList.add('is-pronto');
  }
  const adattaTutti = () => $$('[data-giant]').forEach(adatta);

  function fontPronti() {
    if (!D.fonts?.load) return Promise.resolve();
    const prova = [...new Set($$('[data-giant]').map(g => g.textContent.trim()))].join('') || 'Zeta';
    const attesa = Promise.all([
      D.fonts.load('500 100px "Bodoni Moda"', prova),
      D.fonts.load('400 17px "Manrope"'),
    ]).catch(() => {});
    return Promise.race([attesa, new Promise(r => setTimeout(r, 1800))]);
  }

  /* =====================================================================
     4. HEADER, TENDINA EVENTI, MENU DEL TELEFONO
     ===================================================================== */
  function header() {
    const hd = $('[data-header]');
    if (!hd) return;
    const hero = $('[data-hero]');
    let soglia = 0;
    const calcola = () => { soglia = hero ? Math.max(60, hero.offsetHeight * 0.55) : -1; };
    const aggiorna = () => hd.classList.toggle('is-pieno', scrollY > soglia);
    calcola(); aggiorna();
    addEventListener('scroll', aggiorna, { passive: true });
    allaLarghezza.push(() => { calcola(); aggiorna(); });
  }

  function tendina() {
    const btn = $('[data-tendina-btn]'), pan = $('[data-tendina]');
    if (!btn || !pan) return;
    let aperta = false, anim = null;
    const voci = () => $$('.tendina__a', pan);
    const carica = () => $$('img', pan).forEach(i => { i.loading = 'eager'; });
    btn.addEventListener('pointerenter', carica, { once: true });
    btn.addEventListener('focus', carica, { once: true });
    const apri = primo => {
      if (aperta) return;
      aperta = true; carica();
      pan.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      anim?.kill();
      if (ANIM) {
        anim = gsap.timeline()
          .fromTo(pan, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'power4.out' })
          .fromTo(voci(), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .55, stagger: .045, ease: 'power3.out' }, .1)
          .fromTo('.tendina__piede', { opacity: 0 }, { opacity: 1, duration: .5 }, .3);
      } else pan.classList.add('is-aperta');
      if (primo) voci()[0]?.focus();
    };
    const chiudi = focus => {
      if (!aperta) return;
      aperta = false;
      btn.setAttribute('aria-expanded', 'false');
      anim?.kill();
      const fine = () => { pan.hidden = true; pan.classList.remove('is-aperta'); };
      if (ANIM) anim = gsap.to(pan, { clipPath: 'inset(0% 0% 100% 0%)', duration: .38, ease: 'power2.in', onComplete: fine });
      else fine();
      if (focus) btn.focus();
    };
    btn.addEventListener('click', () => (aperta ? chiudi() : apri()));
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); apri(true); } });
    pan.addEventListener('keydown', e => {
      const l = voci(), i = l.indexOf(D.activeElement);
      if (i < 0) return;
      const vai = n => { e.preventDefault(); l[(n + l.length) % l.length].focus(); };
      if (e.key === 'ArrowDown') vai(i + 2 < l.length ? i + 2 : i + 1);
      else if (e.key === 'ArrowUp') vai(i - 2 >= 0 ? i - 2 : i - 1);
      else if (e.key === 'ArrowRight') vai(i + 1);
      else if (e.key === 'ArrowLeft') vai(i - 1);
      else if (e.key === 'Home') vai(0);
      else if (e.key === 'End') vai(l.length - 1);
    });
    D.addEventListener('keydown', e => { if (e.key === 'Escape' && aperta) chiudi(true); });
    D.addEventListener('pointerdown', e => { if (aperta && !pan.contains(e.target) && !btn.contains(e.target)) chiudi(); });
    pan.addEventListener('click', e => { if (e.target.closest('a')) chiudi(); });
    pan.addEventListener('focusout', e => { if (aperta && e.relatedTarget && !pan.contains(e.relatedTarget) && e.relatedTarget !== btn) chiudi(); });
  }

  function menuTelefono() {
    const btn = $('[data-burger]'), mm = $('[data-mm]');
    if (!btn || !mm) return;
    const etichetta = $('.sr-only', btn);
    const fuori = $$('main, footer');
    let aperto = false, anim = null;
    const apri = () => {
      aperto = true;
      mm.hidden = false;
      H.classList.add('mm-aperto', 'blocca');
      btn.setAttribute('aria-expanded', 'true');
      if (etichetta) etichetta.textContent = 'Chiudi il menu';
      fuori.forEach(n => { n.inert = true; });
      anim?.kill();
      if (ANIM) {
        anim = gsap.timeline()
          .fromTo(mm, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .7, ease: 'power4.inOut' })
          .fromTo($$('.mm__lista > li, .mm__piede > *', mm), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' }, .3);
      } else mm.classList.add('is-aperto');
    };
    const chiudi = () => {
      if (!aperto) return;
      aperto = false;
      H.classList.remove('mm-aperto', 'blocca');
      btn.setAttribute('aria-expanded', 'false');
      if (etichetta) etichetta.textContent = 'Apri il menu';
      fuori.forEach(n => { n.inert = false; });
      anim?.kill();
      const fine = () => { mm.hidden = true; mm.classList.remove('is-aperto'); };
      if (ANIM) anim = gsap.to(mm, { clipPath: 'inset(0% 0% 100% 0%)', duration: .5, ease: 'power3.inOut', onComplete: fine });
      else fine();
    };
    btn.addEventListener('click', () => (aperto ? chiudi() : apri()));
    D.addEventListener('keydown', e => { if (e.key === 'Escape' && aperto) { chiudi(); btn.focus(); } });
    mm.addEventListener('click', e => { if (e.target.closest('a')) chiudi(); });
    allaLarghezza.push(() => { if (innerWidth >= 1024) chiudi(); });
    // accordion "Eventi"
    const acc = $('[data-acc]', mm), sub = acc && $('#' + acc.getAttribute('aria-controls'));
    acc?.addEventListener('click', () => {
      const apre = acc.getAttribute('aria-expanded') !== 'true';
      acc.setAttribute('aria-expanded', String(apre));
      sub.hidden = !apre;
      if (apre && ANIM) gsap.fromTo($$('li', sub), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, stagger: .04, ease: 'power3.out' });
    });
  }

  function barraTelefono() {
    const bar = $('[data-mbar]');
    if (!bar) return;
    const hero = $('[data-hero]');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => bar.classList.toggle('is-su', !e.isIntersecting), { rootMargin: '0px 0px -80% 0px' }).observe(hero);
    } else bar.classList.add('is-su');
    // mentre si scrive nel modulo la barra si nasconde (non copre i campi)
    let t = 0;
    D.addEventListener('focusin', e => { if (e.target.matches('input:not([type=radio]):not([type=checkbox]), select, textarea')) { clearTimeout(t); B.classList.add('scrivendo'); } });
    D.addEventListener('focusout', e => { if (e.target.matches('input:not([type=radio]):not([type=checkbox]), select, textarea')) t = setTimeout(() => B.classList.remove('scrivendo'), 250); });
  }

  /* =====================================================================
     5. CREA IL TUO MENÙ (pagine evento)
        Proposte in config.js (S.menu). Le scelte restano nel browser
        (sessionStorage, solo per la scheda aperta) e finiscono nel
        messaggio WhatsApp e nel riepilogo del preventivo.
     ===================================================================== */
  const CHIAVE_MENU = 'zeta-menu';
  const pezzi = v => String(v || '').split(',').map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
  function leggiMenu() {
    try { const m = JSON.parse(sessionStorage.getItem(CHIAVE_MENU) || 'null'); return m && Array.isArray(m.righe) ? m : null; } catch { return null; }
  }
  function salvaMenu(m) {
    try { if (m.righe.length || m.nome) sessionStorage.setItem(CHIAVE_MENU, JSON.stringify(m)); else sessionStorage.removeItem(CHIAVE_MENU); } catch { /* memoria non disponibile: il menù funziona lo stesso */ }
    D.dispatchEvent(new CustomEvent('zeta:menu'));
  }
  // inizio comune dei messaggi WhatsApp: saluto e, se c'è, il nome
  const saluto = nome => [S.messaggioSaluto || 'Ciao! Ho visto il tuo sito di catering.', ...(nome ? [(S.messaggioNome || 'Sono {nome}.').replace('{nome}', nome)] : [])];
  const pulisci = v => String(v || '').replace(/\s+/g, ' ').trim();
  const tipoEvento = () => (S.preventivo?.tipiEvento || []).find(t => t.evento && t.evento === CHIAVE)?.nome || EVENTO?.nome || '';

  function creaMenu() {
    const box = $('[data-menu]');
    const M = S.menu;
    if (!box || !M || !EVENTO) return;
    const WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 19.8l1.1-3.9A8.3 8.3 0 1 1 8.4 19l-4.2.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6 6 0 0 0 2.6 2.2c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .7-.4 1.4-1 1.7-.7.3-1.6.4-3.3-.4a8.5 8.5 0 0 1-3.6-3.6c-.6-1.2-.6-2.3.1-3.4Z" fill="currentColor"/></svg>';
    const portate = M.portate || [];
    const prima = leggiMenu();
    const iniziali = prima?.pagina === EVENTO.pagina ? Object.fromEntries(prima.righe) : {};
    box.innerHTML = `<span class="menu-carta__etichetta">${esc(M.etichetta || 'Il tuo menù')}</span>
      <p class="menu-carta__titolo">${esc(EVENTO.nome)}</p>
      ${portate.map(([nome, proposte], i) => `<div class="menu-carta__sez mc__riga">
        <h3><label for="mc-${i}">${esc(nome)}</label></h3>
        <textarea class="mc__campo" id="mc-${i}" rows="1" data-portata="${esc(nome)}" autocomplete="off" spellcheck="false" placeholder="${esc(M.segnaposto || '')}" aria-describedby="mc-p-${i}">${esc(iniziali[nome] || '')}</textarea>
        <div class="mc__pillole" id="mc-p-${i}" role="group" aria-label="Proposte per ${esc(nome)}">${proposte.map(p => `<button class="mc__pillola" type="button" aria-pressed="false" data-voce="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      </div>`).join('')}
      <div class="menu-carta__sez mc__nome">
        <h3><label for="mc-nome">${esc(M.nomeEtichetta || 'Il tuo nome')}</label></h3>
        <input class="mc__campo" id="mc-nome" name="nome" required aria-required="true" autocomplete="name" maxlength="80" placeholder="${esc(M.nomeSegnaposto || '')}" value="${esc(prima?.nome || '')}" aria-describedby="mc-avviso">
      </div>
      <div class="mc__invio">
        <a class="btn mc__wa" data-menu-wa target="_blank" rel="noopener" aria-describedby="mc-avviso">${WA}Invia la proposta su WhatsApp</a>
        <p class="mc__avviso" id="mc-avviso" data-menu-avviso>${esc(M.vuoto || '')}</p>
        <p class="modulo__privacy mc__privacy">I dati che inserisci servono solo a preparare il messaggio WhatsApp e non vengono inviati al sito: restano nel tuo browser finché non chiudi la scheda. <a href="${esc(box.dataset.privacy || `${BASE}privacy.html`)}">Leggi l'informativa privacy</a></p>
      </div>`;

    const campi = $$('textarea.mc__campo', box);
    const nome = $('#mc-nome', box);
    const wa = $('[data-menu-wa]', box), avviso = $('[data-menu-avviso]', box);
    const alza = c => { c.style.height = 'auto'; c.style.height = c.scrollHeight + 'px'; };
    function aggiorna(salva = true) {
      const righe = [];
      campi.forEach(c => {
        const scelte = pezzi(c.value).map(x => x.toLowerCase());
        $$('.mc__pillola', c.parentElement).forEach(b => b.setAttribute('aria-pressed', String(scelte.includes(b.dataset.voce.toLowerCase()))));
        const testo = pezzi(c.value).join(', ');
        if (testo) righe.push([c.dataset.portata, testo]);
      });
      const chi = pulisci(nome.value);
      const pieno = righe.length > 0 && !!chi;
      if (pieno) {
        const msg = [...saluto(chi), M.messaggioInizio || 'Ecco la proposta di menù per il mio evento.', `Evento: ${tipoEvento()}`, ...righe.map(([p, t]) => `${p}: ${t}`)].join('\n');
        wa.href = `https://wa.me/${C.whatsapp || ''}?text=${encodeURIComponent(msg)}`;
        wa.removeAttribute('aria-disabled');
      } else {
        wa.removeAttribute('href');
        wa.setAttribute('aria-disabled', 'true');
      }
      avviso.hidden = pieno;
      avviso.textContent = pieno ? '' : !righe.length && !chi ? M.vuoto : !righe.length ? M.senzaPortate : M.senzaNome;
      if (salva) salvaMenu({ pagina: EVENTO.pagina, evento: tipoEvento(), righe, nome: chi });
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('.mc__pillola');
      if (!b) return;
      const c = $('.mc__campo', b.closest('.mc__riga'));
      const lista = pezzi(c.value);
      const i = lista.findIndex(x => x.toLowerCase() === b.dataset.voce.toLowerCase());
      if (i >= 0) lista.splice(i, 1); else lista.push(b.dataset.voce);
      c.value = lista.join(', ');
      alza(c);
      aggiorna();
    });
    campi.forEach(c => {
      c.addEventListener('input', () => { alza(c); aggiorna(); });
      c.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); }); // una riga per portata
      alza(c);
    });
    nome.addEventListener('input', () => aggiorna());
    nome.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    allaLarghezza.push(() => campi.forEach(alza));
    aggiorna(false);
  }

  /* =====================================================================
     6. MAPPA (si carica solo al clic)
     ===================================================================== */
  function mappa() {
    $$('[data-mappa-carica]').forEach(b => b.addEventListener('click', () => {
      const box = b.closest('[data-mappa]');
      const f = D.createElement('iframe');
      f.src = `https://www.google.com/maps?q=${encodeURIComponent(indirizzo())}&output=embed`;
      f.title = `Mappa: ${indirizzo()}`;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      box.replaceChildren(f);
    }));
  }

  /* =====================================================================
     7. PREVENTIVO GUIDATO → riepilogo → messaggio WhatsApp
        Opzioni e testi in config.js (S.preventivo). Il sito non salva
        e non invia nulla: prepara solo il link wa.me.
     ===================================================================== */
  function preventivoGuidato() {
    $$('[data-wa-modulo]').forEach(a => { a.href = linkWa(); });
    const box = $('[data-pg]');
    const P = S.preventivo;
    if (!box || !P) return;
    const T = P.passi || {};
    const ORDINE = ['evento', 'data', 'ospiti', 'luogo', 'servizio', 'extra', 'esigenze', 'note'];
    const N = ORDINE.length;
    const iso = d => `${d.getFullYear()}-${due(d.getMonth() + 1)}-${due(d.getDate())}`;
    const oggi = iso(new Date());
    const dataIt = v => v.split('-').reverse().join('/');
    const sceltaEv = (P.tipiEvento || []).find(t => t.evento && t.evento === CHIAVE);
    const WA_ICONA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 19.8l1.1-3.9A8.3 8.3 0 1 1 8.4 19l-4.2.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6 6 0 0 0 2.6 2.2c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .7-.4 1.4-1 1.7-.7.3-1.6.4-3.3-.4a8.5 8.5 0 0 1-3.6-3.6c-.6-1.2-.6-2.3.1-3.4Z" fill="currentColor"/></svg>';

    const scelte = (nome, tipo, lista, sel) => `<div class="pg__scelte${tipo === 'radio' ? ' pg__scelte--eventi' : ''}">${lista.map(v => `<label class="pg__scelta"><input type="${tipo}" name="${nome}" value="${esc(v)}"${v === sel ? ' checked' : ''}><span class="pg__segno" aria-hidden="true"></span><span>${esc(v)}</span></label>`).join('')}</div>`;
    const testa = (k, extra = '') => `<h3 class="pg__titolo" id="pg-t-${k}" tabindex="-1">${enfasi(T[k]?.titolo || '')}</h3>${T[k]?.aiuto ? `<p class="pg__aiuto" id="pg-a-${k}">${esc(T[k].aiuto)}</p>` : ''}${extra}`;
    const campo = (k, html) => `<div class="pg__campo">${html}<p class="pg__errore" id="pg-e-${k}" hidden></p></div>`;
    const corpo = {
      evento: scelte('evento', 'radio', (P.tipiEvento || []).map(t => t.nome), sceltaEv?.nome),
      data: campo('data', `<input class="pg__input" type="date" name="data" min="${oggi}" aria-labelledby="pg-t-data" aria-describedby="pg-a-data pg-e-data">`),
      ospiti: campo('ospiti', `<input class="pg__input pg__input--corto" type="number" name="ospiti" min="1" max="5000" step="1" inputmode="numeric" placeholder="Es. 80" aria-labelledby="pg-t-ospiti" aria-describedby="pg-a-ospiti pg-e-ospiti">`),
      luogo: `<div class="pg__campo"><input class="pg__input" name="luogo" autocomplete="off" maxlength="120" placeholder="Es. villa a Torre de' Passeri" aria-labelledby="pg-t-luogo" aria-describedby="pg-a-luogo"></div>`,
      servizio: scelte('servizio', 'checkbox', P.servizi || []),
      extra: scelte('extra', 'checkbox', P.extra || []),
      esigenze: `${scelte('esigenze', 'checkbox', P.esigenze || [])}<div class="pg__campo"><label class="pg__etichetta" for="pg-allergie">Allergie o intolleranze <span>(facoltativo)</span></label><input class="pg__input" id="pg-allergie" name="allergie" autocomplete="off" maxlength="200" placeholder="Es. un ospite allergico alla frutta secca"></div>`,
      note: `<div class="pg__campo"><label class="pg__etichetta" for="pg-nome">Nome</label><input class="pg__input" id="pg-nome" name="nome" autocomplete="name" maxlength="80"></div><div class="pg__campo"><label class="pg__etichetta" for="pg-note">Note</label><textarea class="pg__input" id="pg-note" name="note" rows="3" maxlength="600" placeholder="Raccontaci la festa che hai in mente"></textarea></div>`,
    };
    const gruppo = k => ['evento', 'servizio', 'extra', 'esigenze'].includes(k);
    box.innerHTML = `<form class="pg__form" novalidate>
      <div class="pg__testa"><p class="pg__conta" aria-live="polite"><span data-pg-n></span><span data-pg-nome></span></p><div class="pg__barra" aria-hidden="true"><span data-pg-barra></span></div></div>
      <div class="pg__palco">
        ${ORDINE.map((k, i) => `<${gruppo(k) ? 'fieldset' : 'div role="group"'} class="pg__passo" data-passo="${k}" aria-labelledby="pg-t-${k}"${i ? ' hidden' : ''}>${testa(k)}${corpo[k]}</${gruppo(k) ? 'fieldset' : 'div'}>`).join('')}
        <div class="pg__passo pg__riepilogo" data-passo="riepilogo" hidden>
          <button class="pg__torna" type="button" data-pg-indietro>${ICONA.sx}Indietro</button>
          <h3 class="pg__titolo" id="pg-t-riepilogo" tabindex="-1">Il tuo <em>riepilogo</em></h3>
          <p class="pg__aiuto">Controlla le scelte: con «Modifica» torni al passo.</p>
          <dl class="pg__lista" data-pg-lista></dl>
          <p class="pg__solo" data-pg-solo hidden>Hai indicato solo il tipo di evento: puoi inviare così oppure aggiungere qualche dettaglio.</p>
          <a class="btn pg__wa" data-pg-wa href="#" target="_blank" rel="noopener">${WA_ICONA}Invia la richiesta su WhatsApp</a>
        </div>
      </div>
      <p class="pg__avviso" id="pg-avviso" data-pg-avviso hidden>Scegli il tipo di evento per continuare: tutto il resto è facoltativo.</p>
      <div class="pg__nav" data-pg-nav>
        <button class="pg__torna" type="button" data-pg-indietro>${ICONA.sx}Indietro</button>
        <button class="link-sottile pg__salta" type="button" data-pg-salta aria-describedby="pg-avviso">Vai al riepilogo</button>
        <button class="btn pg__avanti" type="submit" data-pg-avanti aria-describedby="pg-avviso"><span data-pg-avanti-t>Avanti</span>${ICONA.freccia}</button>
      </div>
      <p class="modulo__privacy pg__privacy">I dati che inserisci servono solo a preparare il messaggio WhatsApp e non vengono salvati dal sito. <a href="${esc(box.dataset.privacy || `${BASE}privacy.html`)}">Leggi l'informativa privacy</a></p>
    </form>`;

    const f = $('form', box), el = f.elements;
    const passi = Object.fromEntries($$('[data-passo]', f).map(p => [p.dataset.passo, p]));
    const avanti = $('[data-pg-avanti]', f), salta = $('[data-pg-salta]', f), avviso = $('[data-pg-avviso]', f);
    const nav = $('[data-pg-nav]', f), indietroNav = $('[data-pg-indietro]', nav);
    let corrente = 'evento', ultimoPasso = 'evento', giro = 0, altezza = 0;

    const valori = n => $$(`input[name="${n}"]:checked`, f).map(i => i.value);
    const pulito = n => (el[n]?.value || '').trim().replace(/\s+/g, ' ');
    const evento = () => valori('evento')[0] || '';
    const errore = (k, msg) => {
      const e = $(`#pg-e-${k}`, f), inp = el[k];
      if (e) { e.textContent = msg; e.hidden = !msg; }
      inp?.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    const controlla = {
      data: () => { const v = el.data.value; return errore('data', el.data.validity.badInput ? 'Controlla la data.' : v && v < oggi ? 'La data non può essere già passata.' : ''); },
      ospiti: () => { const v = el.ospiti.value; return errore('ospiti', el.ospiti.validity.badInput || (v && (!Number.isInteger(+v) || +v < 1 || +v > 5000)) ? 'Scrivi un numero di ospiti valido.' : ''); },
    };
    // voci compilate, nell'ordine dei passi: [passo, voce, valore]
    function voci() {
      const v = [];
      const metti = (k, voce, val) => { if (val) v.push([k, voce, val]); };
      metti('evento', T.evento?.voce || 'Evento', evento());
      if (controlla.data()) metti('data', T.data?.voce || 'Data', el.data.value && dataIt(el.data.value));
      if (controlla.ospiti()) metti('ospiti', T.ospiti?.voce || 'Ospiti', el.ospiti.value && String(+el.ospiti.value));
      metti('luogo', T.luogo?.voce || 'Luogo', pulito('luogo'));
      metti('servizio', T.servizio?.voce || 'Servizio', valori('servizio').join(', '));
      metti('extra', T.extra?.voce || 'Extra', valori('extra').join(', '));
      metti('esigenze', T.esigenze?.voce || 'Esigenze alimentari', valori('esigenze').join(', '));
      metti('esigenze', T.esigenze?.voceAllergie || 'Allergie', pulito('allergie'));
      metti('nome', T.note?.voce || 'Nome', pulito('nome'));
      metti('note', T.note?.voceNote || 'Note', pulito('note'));
      return v;
    }
    // il nome va nel saluto ("Sono …"), non si ripete nell'elenco
    const messaggio = v => [...saluto(pulito('nome')), P.messaggioInizio || 'Vorrei un preventivo per il catering.', ...v.filter(([k]) => k !== 'nome').map(([, voce, val]) => `${voce}: ${val}`)].join('\n');

    function aggiornaPulsanti() {
      const ok = !!evento();
      avanti.disabled = !ok; salta.disabled = !ok;
      avviso.hidden = ok;
    }
    function aggiornaTesta(k) {
      const i = ORDINE.indexOf(k);
      $('[data-pg-n]', f).textContent = i < 0 ? 'Riepilogo' : `Passo ${i + 1} di ${N}`;
      $('[data-pg-nome]', f).textContent = i < 0 ? 'Tutto pronto' : (T[k]?.voce || '');
      $('[data-pg-barra]', f).style.transform = `scaleX(${i < 0 ? 1 : (i + 1) / (N + 1)})`;
      nav.hidden = i < 0;
      indietroNav.style.visibility = i > 0 ? '' : 'hidden';
      salta.hidden = i === N - 1;
      $('[data-pg-avanti-t]', f).textContent = i === N - 1 ? 'Riepilogo' : 'Avanti';
    }
    function riepilogo() {
      const v = voci();
      const menu = leggiMenu()?.righe || [];
      $('[data-pg-lista]', f).innerHTML = v.map(([k, voce, val]) => `<div class="pg__riga"><dt>${esc(voce)}</dt><dd>${esc(val)}</dd><button class="pg__modifica" type="button" data-vai="${k === 'nome' ? 'note' : k}">Modifica<span class="sr-only"> ${esc(voce.toLowerCase())}</span></button></div>`).join('')
        + (menu.length ? `<div class="pg__riga"><dt>Menù</dt><dd class="pg__menu">${menu.map(([p, t]) => `<span><b>${esc(p)}</b> ${esc(t)}</span>`).join('')}</dd><a class="pg__modifica" href="${esc(`${BASE}eventi/${leggiMenu().pagina}.html#menu`)}">Modifica<span class="sr-only"> menù</span></a></div>` : '');
      $('[data-pg-solo]', f).hidden = v.length !== 1 || menu.length > 0;
      const testo = messaggio(v) + (menu.length ? `\nMenù:\n${menu.map(([p, t]) => `${p}: ${t}`).join('\n')}` : '');
      $('[data-pg-wa]', f).href = `https://wa.me/${C.whatsapp || ''}?text=${encodeURIComponent(testo)}`;
    }
    // il nome scritto nel menù compare già nel preventivo (finché non lo cambi qui)
    let nomeDalMenu = '';
    const prendiNome = () => {
      const n = leggiMenu()?.nome || '';
      if (n && (!el.nome.value || el.nome.value === nomeDalMenu)) el.nome.value = n;
      nomeDalMenu = n;
    };
    prendiNome();
    D.addEventListener('zeta:menu', () => { prendiNome(); if (corrente === 'riepilogo') riepilogo(); });

    function vai(k, dir = 1) {
      const nuovo = passi[k];
      const vecchio = Object.values(passi).find(p => !p.hidden);
      if (!nuovo || nuovo === vecchio) return;
      if (k !== 'riepilogo') ultimoPasso = k;
      corrente = k;
      if (k === 'riepilogo') riepilogo();
      aggiornaTesta(k);
      const t = ++giro;
      const mostra = () => {
        if (t !== giro) return;
        Object.values(passi).forEach(p => { p.hidden = p !== nuovo; });
        if (!RIDOTTO && nuovo.animate) nuovo.animate([{ opacity: 0, transform: `translate3d(${dir * 28}px,0,0)` }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
        $('.pg__titolo', nuovo).focus({ preventScroll: true });
        // le animazioni allo scorrimento si ricalcolano solo se cambia l'altezza del modulo
        const h = f.offsetHeight;
        if (ANIM && Math.abs(h - altezza) > 1) { altezza = h; ScrollTrigger.refresh(); }
      };
      Object.values(passi).forEach(p => p.getAnimations?.().forEach(a => a.cancel()));
      if (RIDOTTO || !vecchio?.animate) return mostra();
      vecchio.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translate3d(${dir * -16}px,0,0)` }], { duration: 200, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.then(mostra, () => {});
    }
    // prima di lasciare il passo: niente date passate o numeri sbagliati
    const passoValido = () => (controlla[corrente] ? controlla[corrente]() : true);
    const datiValidi = () => {
      if (!controlla.data()) { vai('data', -1); return false; }
      if (!controlla.ospiti()) { vai('ospiti', -1); return false; }
      return true;
    };

    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!evento() || !passoValido()) return;
      const i = ORDINE.indexOf(corrente);
      if (i === N - 1) { if (datiValidi()) vai('riepilogo'); } else if (i >= 0) vai(ORDINE[i + 1]);
    });
    salta.addEventListener('click', () => { if (evento() && passoValido() && datiValidi()) vai('riepilogo'); });
    $$('[data-pg-indietro]', f).forEach(b => b.addEventListener('click', () => {
      if (corrente === 'riepilogo') return vai(ultimoPasso, -1);
      const i = ORDINE.indexOf(corrente);
      if (i > 0) vai(ORDINE[i - 1], -1);
    }));
    $('[data-pg-lista]', f).addEventListener('click', e => { const b = e.target.closest('[data-vai]'); if (b) vai(b.dataset.vai, -1); });
    f.addEventListener('change', aggiornaPulsanti);
    f.addEventListener('input', e => { const k = e.target.name; if (controlla[k] && e.target.getAttribute('aria-invalid') === 'true') controlla[k](); });
    el.data.addEventListener('change', controlla.data);

    aggiornaPulsanti();
    aggiornaTesta('evento');
    altezza = f.offsetHeight;
  }

  /* =====================================================================
     8. VIDEO: parte solo quando è sullo schermo, uno alla volta
     ===================================================================== */
  let videoCorrente = null, heroVisibile = false, videoHero = null;
  const suona = v => {
    if (videoCorrente && videoCorrente !== v) videoCorrente.pause();
    videoCorrente = v;
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => {}); // autoplay bloccato: resta il poster, nessun errore in console
    return p;
  };
  const ferma = v => { v.pause(); if (videoCorrente === v) videoCorrente = null; };

  function heroVideo() {
    const v = $('[data-video-hero]');
    if (!v) return;
    if (RIDOTTO || navigator.connection?.saveData) return; // resta il poster
    videoHero = v;
    v.muted = true; v.playsInline = true;
    const scegli = () => {
      const s = MQ_TEL.matches ? v.dataset.srcTel : v.dataset.srcPc;
      if (v.dataset.attuale === s) return false;
      v.dataset.attuale = s; v.classList.remove('is-on'); v.src = s; v.load();
      return true;
    };
    scegli();
    v.addEventListener('playing', () => v.classList.add('is-on'));
    new IntersectionObserver(([e]) => {
      heroVisibile = e.isIntersecting;
      if (heroVisibile) suona(v); else ferma(v);
    }, { threshold: 0.12 }).observe(v.closest('[data-hero]'));
    allaLarghezza.push(() => { if (scegli() && heroVisibile) suona(v); });
    D.addEventListener('visibilitychange', () => { if (D.hidden) v.pause(); else if (heroVisibile) suona(v); });
  }

  /* ---------- Anteprime delle card ----------
     Il poster è il primo fotogramma della clip: il video compare in dissolvenza
     solo quando il primo fotogramma è pronto e, quando si spegne, torna all'inizio. */
  let autoplayBloccato = false; // es. iPhone in Risparmio energetico: restano i poster
  const carica = v => {
    if (!v || v.hasAttribute('src')) return;
    const img = v.parentElement.querySelector('.card__img');
    if (img) { if (img.loading === 'lazy') img.loading = 'eager'; if (img.currentSrc) v.poster = img.currentSrc; }
    v.preload = 'auto';
    v.src = v.dataset.src;
  };
  const accendi = v => {
    carica(v);
    clearTimeout(v._riavvolgi);
    if (!v._ascolta) {
      v._ascolta = true;
      v.addEventListener('playing', () => {
        const mostra = () => { if (videoCorrente === v && !v.paused) v.classList.add('is-on'); };
        if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(mostra);
        setTimeout(mostra, 250); // riserva, se il fotogramma non viene segnalato
      });
    }
    const p = suona(v);
    if (p) p.catch(err => { if (err && err.name === 'NotAllowedError') { autoplayBloccato = true; spegni(v, true); } });
  };
  const spegni = (v, riavvolgi) => {
    v.classList.remove('is-on');
    ferma(v);
    clearTimeout(v._riavvolgi);
    // dopo la dissolvenza (già invisibile) torna al primo fotogramma, uguale al poster
    if (riavvolgi) v._riavvolgi = setTimeout(() => { if (v.paused) { try { v.currentTime = 0; } catch {} } }, 700);
  };

  // Computer: il video parte al passaggio del mouse (come prima)
  function anteprimeCard() {
    if (RIDOTTO) return; // solo foto
    $$('.card__a').forEach(a => {
      const v = $('.card__video', a);
      if (!v) return;
      a.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse' || !PUNTATORE.matches) return; // sul touch decide lo scorrimento, non il tocco
        accendi(v);
      });
      a.addEventListener('pointerleave', e => {
        if (e.pointerType !== 'mouse' || !PUNTATORE.matches) return;
        spegni(v, false);
        if (videoHero && heroVisibile) suona(videoHero);
      });
    });
  }

  // Telefono e tablet (touch): parte da sola la card più visibile e centrata.
  // - un IntersectionObserver con root = carosello (soglia 0.6) dice quali card sono ben dentro il carosello;
  // - un secondo, sullo schermo (soglia 0.6), controlla che la card sia davvero visibile anche in verticale.
  // Un solo video alla volta, la card dopo si prepara in anticipo, il tocco apre sempre la pagina dell'evento.
  function autoplayCard() {
    if (RIDOTTO || navigator.connection?.saveData || !('IntersectionObserver' in window)) return; // solo poster
    const aggiornatori = [];
    $$('.carosello').forEach(car => {
      const medie = $$('.card__media', car).filter(m => $('.card__video', m));
      if (!medie.length) return;
      const vid = m => $('.card__video', m);
      const dentro = new Set(), aVista = new Set();
      let attiva = null, tPrima = 0;
      const segna = (insieme, voci) => voci.forEach(e => (e.isIntersecting && e.intersectionRatio >= 0.59 ? insieme.add(e.target) : insieme.delete(e.target)));
      const scorre = () => car.scrollWidth > car.clientWidth + 2; // carosello (telefono) o griglia (tablet)
      const candidate = () => medie.filter(m => dentro.has(m) && aVista.has(m));
      const scegli = () => {
        if (D.hidden || autoplayBloccato || PUNTATORE.matches) return null;
        const c = candidate();
        if (c.length < 2) return c[0] || null;
        if (!scorre()) return c.includes(attiva) ? attiva : c[0]; // griglia: si va a turno (vedi sotto)
        const r = car.getBoundingClientRect(), centro = r.left + r.width / 2;
        const dist = m => { const q = m.getBoundingClientRect(); return Math.abs(q.left + q.width / 2 - centro); };
        return c.reduce((x, y) => (dist(y) < dist(x) ? y : x));
      };
      const vai = nuova => {
        if (nuova === attiva) { if (nuova && vid(nuova).paused) accendi(vid(nuova)); return; }
        if (attiva) spegni(vid(attiva), true);
        attiva = nuova; tPrima = 0;
        if (!attiva) { if (videoHero && heroVisibile && !D.hidden) suona(videoHero); return; }
        accendi(vid(attiva));
        const dopo = medie[medie.indexOf(attiva) + 1];
        if (dopo) carica(vid(dopo)); // prepara la card successiva
      };
      const aggiorna = () => vai(scegli());

      const ioCarosello = new IntersectionObserver(v => { segna(dentro, v); aggiorna(); }, { root: car, threshold: [0, 0.6, 1] });
      const ioSchermo = new IntersectionObserver(v => { segna(aVista, v); aggiorna(); }, { rootMargin: '-8% 0px -8% 0px', threshold: [0, 0.6, 1] });
      medie.forEach(m => { ioCarosello.observe(m); ioSchermo.observe(m); });

      // la prima clip si carica quando la sezione è a mezzo schermo di distanza
      const ioVicino = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting || PUNTATORE.matches || autoplayBloccato) return;
        carica(vid(medie[0])); ioVicino.disconnect();
      }, { rootMargin: '0px 0px 50% 0px' });
      ioVicino.observe(car);

      // griglia (tablet, più card visibili insieme): a ogni giro della clip tocca alla card successiva
      medie.forEach(m => vid(m).addEventListener('timeupdate', () => {
        if (m !== attiva) return;
        const t = vid(m).currentTime, giro = t + 0.25 < tPrima;
        tPrima = t;
        if (!giro || scorre()) return;
        const c = candidate();
        if (c.length > 1 && c.includes(m)) vai(c[(c.indexOf(m) + 1) % c.length]);
      }));
      aggiornatori.push(aggiorna);
    });
    if (!aggiornatori.length) return;
    const tutti = () => aggiornatori.forEach(f => f());
    D.addEventListener('visibilitychange', tutti);
    PUNTATORE.addEventListener?.('change', tutti);
    allaLarghezza.push(tutti);
  }

  /* =====================================================================
     9. STRISCE DI FOTO: scorrimento continuo (rAF + translate3d)
     Non si fermano al passaggio del mouse. Si fermano solo fuori schermo
     e con la lightbox aperta; ripartono da dove erano.
     ===================================================================== */
  const strisce = [];
  let rafId = 0, tPrec = 0, lbAperta = false;
  function ciclo(t) {
    const dt = tPrec ? Math.min(0.05, (t - tPrec) / 1000) : 0;
    tPrec = t;
    let vive = 0;
    for (const s of strisce) if (s.vai && s.visibile && !lbAperta) { s.passo(dt); vive++; }
    if (vive) rafId = requestAnimationFrame(ciclo);
    else { rafId = 0; tPrec = 0; }
  }
  const avvia = () => { if (!rafId) { tPrec = 0; rafId = requestAnimationFrame(ciclo); } };

  class Striscia {
    constructor(el) {
      this.el = el;
      this.vista = $('.striscia__vista', el);
      this.dentro = $('.striscia__in', el);
      this.traccia = $('.striscia__traccia', el);
      this.dir = +el.dataset.dir || -1;
      this.x = 0; this.spinta = 0; this.fattore = 1;
      this.vai = false; this.visibile = false; this.trascina = false; this.bloccaClic = 0;
      this.originali = $$('.striscia__item', this.traccia);
      $('.striscia__freccia--next', el).addEventListener('click', () => this.spingi(-1));
      $('.striscia__freccia--prev', el).addEventListener('click', () => this.spingi(1));
      if (RIDOTTO) return;
      this.costruisci();
      this.trascinamento();
      new IntersectionObserver(([e]) => { this.visibile = e.isIntersecting; if (this.visibile) avvia(); }, { rootMargin: '80px 0px' }).observe(el);
    }
    velocita() { return innerWidth < 768 ? 24 : 34; } // pixel al secondo
    costruisci() {
      $$('.is-clone', this.traccia).forEach(n => n.remove());
      const gap = parseFloat(getComputedStyle(this.traccia).columnGap) || 0;
      this.periodo = this.traccia.scrollWidth + gap;
      const copie = Math.ceil(this.vista.clientWidth / this.periodo) + 1;
      for (let k = 0; k < copie; k++) this.originali.forEach(n => {
        const c = n.cloneNode(true);
        c.classList.add('is-clone'); c.setAttribute('aria-hidden', 'true');
        $$('button', c).forEach(b => { b.tabIndex = -1; });
        this.traccia.append(c);
      });
      this.applica();
    }
    applica() {
      const P = this.periodo;
      if (!P) return;
      this.x = ((this.x % P) - P) % P; // sempre tra -periodo e 0: giro infinito senza salti
      this.traccia.style.transform = `translate3d(${this.x.toFixed(2)}px,0,0)`;
    }
    passo(dt) {
      if (this.trascina) return;
      const k = 1 - Math.exp(-dt * 5);
      const d = this.spinta * k;
      this.spinta -= d;
      if (Math.abs(this.spinta) < 0.5) { this.spinta = 0; this.fattore = Math.min(1, this.fattore + dt * 0.8); }
      this.x += this.dir * this.velocita() * this.fattore * dt + d;
      this.applica();
    }
    spingi(verso) {
      if (RIDOTTO) {
        this.vista.scrollBy({ left: -verso * this.vista.clientWidth * 0.8, behavior: 'auto' });
        this.traccia.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
        return;
      }
      this.spinta += verso * this.vista.clientWidth * 0.55;
      this.fattore = 0;
      if (!this.vai) { this.x += this.spinta; this.spinta = 0; this.applica(); }
      avvia();
    }
    trascinamento() {
      const v = this.vista;
      let id = null, x0 = 0, xs = 0, ult = 0, tUlt = 0, vel = 0, mosso = false;
      v.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        if (e.pointerType === 'mouse') e.preventDefault();
        id = e.pointerId; x0 = ult = e.clientX; xs = this.x; tUlt = performance.now(); vel = 0; mosso = false;
      });
      v.addEventListener('pointermove', e => {
        if (e.pointerId !== id) return;
        const dx = e.clientX - x0;
        if (!mosso && Math.abs(dx) > 6) { mosso = true; this.trascina = true; v.setPointerCapture(id); v.classList.add('is-trascina'); }
        if (!mosso) return;
        this.x = xs + dx; this.applica();
        const ora = performance.now();
        vel = ((e.clientX - ult) / Math.max(1, ora - tUlt)) * 1000; ult = e.clientX; tUlt = ora;
      });
      const fine = e => {
        if (e.pointerId !== id) return;
        id = null;
        if (!mosso) return;
        this.trascina = false; v.classList.remove('is-trascina');
        this.spinta = Math.max(-1600, Math.min(1600, vel)) * 0.28; this.fattore = 0; this.bloccaClic = performance.now();
        avvia();
      };
      v.addEventListener('pointerup', fine);
      v.addEventListener('pointercancel', fine);
      v.addEventListener('click', e => { if (performance.now() - this.bloccaClic < 90) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
    entra(ritardo = 0) {
      if (!ANIM) { this.vai = true; avvia(); return; }
      const voci = $$('.striscia__item', this.traccia).slice(0, 9);
      const bottoni = voci.map(n => $('.striscia__btn', n));
      const da = this.dir < 0 ? 1 : -1; // riga alta entra da destra, riga bassa da sinistra
      gsap.timeline({ delay: ritardo, onComplete: () => { this.vai = true; avvia(); } })
        .fromTo(this.dentro, { x: da * innerWidth * 0.2 }, { x: 0, duration: 1.7, ease: 'power3.out', clearProps: 'transform' }, 0)
        .fromTo(voci, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, stagger: 0.09, ease: 'power3.inOut' }, 0)
        .fromTo(bottoni, { scale: 1.12 }, { scale: 1, duration: 1.5, stagger: 0.09, ease: 'power3.out', clearProps: 'transform' }, 0.05);
    }
  }

  function avviaStrisce() {
    const box = $('[data-render="strisce"]');
    if (!box) return;
    if (RIDOTTO) box.classList.add('is-ferme');
    $$('.striscia', box).forEach(el => strisce.push(new Striscia(el)));
    allaLarghezza.push(() => strisce.forEach(s => !RIDOTTO && s.costruisci()));
    // lightbox
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-lb]');
      if (b) apriLightbox(box.dataset.gruppo, box._foto, +b.dataset.lb, b);
    });
    // entrata quando la galleria arriva sullo schermo, poi lo scorrimento continuo
    if (!ANIM) { strisce.forEach(s => s.entra()); return; }
    strisce.forEach(s => {
      gsap.set($$('.striscia__item', s.traccia).slice(0, 9), { clipPath: 'inset(100% 0% 0% 0%)' });
    });
    ScrollTrigger.create({ trigger: box, start: 'top 85%', once: true, onEnter: () => strisce.forEach((s, i) => s.entra(i * 0.18)) });
  }

  /* =====================================================================
     10. LIGHTBOX
     ===================================================================== */
  const LB = { el: null, foto: [], g: '', i: 0, ritorno: null, img: null, conta: null, dida: null };
  function creaLightbox() {
    const el = D.createElement('div');
    el.className = 'lb'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Galleria fotografica');
    el.innerHTML = `
      <div class="lb__barra"><p class="lb__conta" aria-live="polite"></p><button class="lb__chiudi" type="button" aria-label="Chiudi la galleria">${ICONA.x}</button></div>
      <div class="lb__palco"><img class="lb__img" alt="" draggable="false">
        <button class="lb__nav lb__nav--prev" type="button" aria-label="Foto precedente">${ICONA.sx}</button>
        <button class="lb__nav lb__nav--next" type="button" aria-label="Foto successiva">${ICONA.dx}</button></div>
      <p class="lb__dida"></p>`;
    B.append(el);
    Object.assign(LB, { el, img: $('.lb__img', el), conta: $('.lb__conta', el), dida: $('.lb__dida', el) });
    $('.lb__chiudi', el).addEventListener('click', chiudiLightbox);
    $('.lb__nav--prev', el).addEventListener('click', () => mostraFoto(LB.i - 1));
    $('.lb__nav--next', el).addEventListener('click', () => mostraFoto(LB.i + 1));
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') chiudiLightbox();
      else if (e.key === 'ArrowLeft') mostraFoto(LB.i - 1);
      else if (e.key === 'ArrowRight') mostraFoto(LB.i + 1);
      else if (e.key === 'Tab') {
        const f = $$('button', el), i = f.indexOf(D.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    const palco = $('.lb__palco', el);
    let x0 = null, y0 = 0;
    palco.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; });
    palco.addEventListener('pointerup', e => {
      if (x0 == null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) mostraFoto(LB.i + (dx < 0 ? 1 : -1));
    });
    palco.addEventListener('click', e => { if (e.target === palco) chiudiLightbox(); });
  }
  function mostraFoto(i) {
    const n = LB.foto.length;
    LB.i = (i + n) % n;
    const f = LB.foto[LB.i];
    LB.img.classList.add('is-cambio');
    const nuova = new Image();
    nuova.sizes = '100vw';
    nuova.srcset = srcset(LB.g, f);
    nuova.src = src(LB.g, f, 1920);
    const metti = () => {
      LB.img.sizes = '100vw'; LB.img.srcset = nuova.srcset; LB.img.src = nuova.src;
      LB.img.alt = f[3]; LB.img.width = f[1]; LB.img.height = f[2];
      requestAnimationFrame(() => LB.img.classList.remove('is-cambio'));
    };
    if (nuova.decode) nuova.decode().then(metti, metti); else nuova.onload = metti;
    LB.conta.textContent = `${LB.i + 1} / ${n}`;
    LB.dida.textContent = f[3];
    [LB.i + 1, LB.i - 1].forEach(k => { const p = LB.foto[(k + n) % n]; const im = new Image(); im.sizes = '100vw'; im.srcset = srcset(LB.g, p); });
  }
  function apriLightbox(g, foto, i, ritorno) {
    if (!LB.el) creaLightbox();
    Object.assign(LB, { g, foto, ritorno });
    lbAperta = true;
    H.classList.add('blocca');
    LB.el.hidden = false;
    mostraFoto(i);
    requestAnimationFrame(() => LB.el.classList.add('is-aperto'));
    $('.lb__chiudi', LB.el).focus();
  }
  function chiudiLightbox() {
    if (!LB.el || LB.el.hidden) return;
    LB.el.classList.remove('is-aperto');
    H.classList.remove('blocca');
    setTimeout(() => { LB.el.hidden = true; }, 360);
    lbAperta = false;
    avvia(); // le strisce ripartono da dove erano
    LB.ritorno?.focus({ preventScroll: true });
  }

  /* =====================================================================
     11. FAQ (apertura con dissolvenza)
     ===================================================================== */
  function faq() {
    $$('.faq__i').forEach(d => d.addEventListener('toggle', () => {
      if (d.open && ANIM) gsap.fromTo($('.faq__r', d), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
    }));
  }

  /* =====================================================================
     12. ANIMAZIONI (entrata hero + scorrimento)
     ===================================================================== */
  function entrata() {
    const hero = $('[data-hero]');
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    const scala = hero && $('.hero__scala', hero);
    if (scala) tl.fromTo(scala, { scale: 1.08 }, { scale: 1, duration: 1.7, ease: 'power3.out' }, 0);
    const lettere = $$('.hero .ch__in');
    if (lettere.length) tl.fromTo(lettere, { yPercent: 118 }, { yPercent: 0, duration: 1.05, stagger: lettere.length > 10 ? 0.04 : 0.065 }, 0.12);
    tl.fromTo('.hd__nav', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 0.7);
    const resto = $$('.hero [data-entra]');
    if (resto.length) tl.fromTo(resto, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .9, stagger: .09, ease: 'power3.out' }, 0.82);
    gsap.set('[data-entra]', { visibility: 'visible' });
    return tl;
  }

  function scorrimento() {
    const hero = $('[data-hero]');
    if (hero) {
      gsap.to($('.hero__media', hero), { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to($('.hero__nome', hero), { y: () => hero.offsetHeight * 0.3, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: true, invalidateOnRefresh: true } });
      gsap.to($('.hero__basso', hero), { opacity: 0, y: -24, ease: 'none', scrollTrigger: { trigger: hero, start: '4% top', end: '38% top', scrub: true } });
    }

    // titoli: righe che salgono dietro una maschera
    if (SplitText) {
      $$('[data-titolo]').forEach(el => SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'riga', autoSplit: true,
        onSplit: s => gsap.from(s.lines, { yPercent: 112, duration: 1.15, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      }));
      // frase grande: si rivela riga per riga mentre si scorre
      $$('[data-frase]').forEach(el => SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'riga', autoSplit: true,
        onSplit: s => gsap.fromTo(s.lines, { yPercent: 100, opacity: 0.25 }, { yPercent: 0, opacity: 1, stagger: 0.22, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'bottom 72%', scrub: 0.6 } }),
      }));
    }

    // foto grandi: tendina dal basso + ritorno di scala, poi leggera parallasse
    $$('[data-tenda]').forEach(el => {
      const im = () => $('img', el);
      if (!im()) return;
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power3.inOut' })
        .fromTo(im(), { scale: 1.18 }, { scale: 1, duration: 1.7, ease: 'power3.out' }, 0.08);
      gsap.fromTo(im(), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // testi e blocchi: comparsa morbida
    const rivela = $$('[data-rivela]');
    if (rivela.length) {
      gsap.set(rivela, { opacity: 0, y: 26 });
      ScrollTrigger.batch(rivela, { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }) });
    }

    // card eventi: si rivelano dal basso, una dopo l'altra
    const cards = $$('[data-card]');
    if (cards.length) {
      gsap.set(cards, { clipPath: 'inset(100% 0% 0% 0%)' });
      ScrollTrigger.batch(cards, {
        start: 'top 92%', once: true,
        onEnter: b => {
          gsap.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.12, ease: 'power3.inOut' });
          gsap.fromTo(b.map(c => $('.card__zoom', c)), { scale: 1.14 }, { scale: 1, duration: 1.6, stagger: 0.12, ease: 'power3.out' });
        },
      });
    }

    // passi: linea che si disegna con lo scorrimento
    $$('.passi__corpo').forEach(c => {
      gsap.fromTo($('.passi__linea-in', c), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top 72%', end: 'bottom 72%', scrub: 0.4 } });
      $$('.passo', c).forEach(p => gsap.from(p, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 82%', once: true } }));
    });

    // passaggio avorio → inchiostro: la fascia scura entra come una tavola
    // con i margini e si allarga fino ai bordi (solo clip-path, nessun grigio a metà)
    $$('[data-scuro]').forEach(z => {
      const lato = () => Math.round(Math.min(innerWidth * 0.045, 64));
      gsap.fromTo(z, { clipPath: () => `inset(0px ${lato()}px 0px ${lato()}px)` }, {
        clipPath: 'inset(0px 0px 0px 0px)', ease: 'none',
        onComplete: () => { z.style.clipPath = 'none'; }, // a tutta larghezza non ritaglia nulla
        scrollTrigger: { trigger: z, start: 'top bottom', end: 'top 25%', scrub: 0.5, invalidateOnRefresh: true },
      });
    });
  }

  /* =====================================================================
     AVVIO
     ===================================================================== */
  riempi();
  rendi();
  preparaGiganti();
  header();
  tendina();
  menuTelefono();
  barraTelefono();
  creaMenu();
  mappa();
  preventivoGuidato();
  faq();
  heroVideo();
  anteprimeCard();
  autoplayCard();

  const attesa = ms => new Promise(r => setTimeout(r, ms));
  const fotoHero = $('.hero__media img');
  const heroPronta = fotoHero?.decode ? Promise.race([fotoHero.decode().catch(() => {}), attesa(1600)]) : Promise.resolve();
  Promise.all([fontPronti(), heroPronta]).then(() => {
    adattaTutti();
    allaLarghezza.unshift(adattaTutti);
    avviaStrisce();
    if (ANIM) {
      entrata();
      scorrimento();
      ScrollTrigger.refresh();
    } else {
      $$('[data-entra]').forEach(n => { n.style.visibility = 'visible'; });
    }
  });
})();
