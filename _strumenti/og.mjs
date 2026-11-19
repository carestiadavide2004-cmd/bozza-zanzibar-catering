// Crea le immagini di anteprima social (1200x630) e le icone del sito.
// Uso: node _strumenti/og.mjs   (serve Playwright, già installato in ~/.carestia-qa)
//      node _strumenti/og.mjs comunioni aperitivi   -> rifà solo le anteprime di questi eventi (niente home, niente icone)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(homedir(), '.carestia-qa/'));
const { chromium } = require('playwright');
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(ROOT, 'config.js'), 'utf8'), ctx);
const S = ctx.window.SITO;
const f = p => pathToFileURL(join(ROOT, p)).href;
const TMP = mkdtempSync(join(tmpdir(), 'og-'));
mkdirSync(join(ROOT, 'assets/og'), { recursive: true });
mkdirSync(join(ROOT, 'assets/icone'), { recursive: true });

const font = `@font-face{font-family:B;src:url(${f('fonts/bodoni-moda-latin.woff2')});font-weight:400 900}
@font-face{font-family:M;src:url(${f('fonts/manrope-latin.woff2')});font-weight:200 800}`;
const solo = process.argv.slice(2);
const inBasso = new Set(['comunioni']); // il viso della bambina è al centro dell'immagine: il titolo scende sopra la veste
const pagine = [
  { file: 'home', img: 'assets/img/home/hero-computer-1920.webp', titolo: S.nome, sopra: `${S.sottotitolo} · ${S.contatti.citta}`, pos: '50% 78%' },
  ...S.eventi.map(e => ({ file: e.chiave, img: `assets/video/${e.chiave}-orizzontale-1920.webp`, titolo: e.titolo, sopra: `${S.nome} · ${S.sottotitolo}`, pos: '50% 50%', basso: inBasso.has(e.chiave) })),
].filter(p => !solo.length || solo.includes(p.file));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const p of pagine) {
  const html = `<!doctype html><meta charset="utf-8"><style>${font}
  *{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;background:#15120F;position:relative;font-family:M}
  img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${p.pos}}
  .o{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,11,9,.6),rgba(14,11,9,.15) 45%,rgba(14,11,9,.55))}
  .basso .o{background:linear-gradient(180deg,rgba(14,11,9,.45),rgba(14,11,9,.06) 36%,rgba(14,11,9,.42) 58%,rgba(14,11,9,.76))}
  h1{position:absolute;left:0;right:0;top:70px;text-align:center;color:#FBF8F2;font:500 200px/1 B;letter-spacing:-.012em;white-space:nowrap}
  p{position:absolute;left:0;right:0;bottom:56px;text-align:center;color:#FBF8F2;font:600 17px/1 M;letter-spacing:.3em;text-transform:uppercase}
  p::before,p::after{content:"";display:inline-block;width:40px;height:1px;background:#D98B5F;vertical-align:middle;margin:0 18px}
  </style><img src="${f(p.img)}"><div class="o"></div><h1>${p.titolo}</h1><p>${p.sopra}</p>
  <script>${p.basso ? "document.body.classList.add('basso');" : ''}document.fonts.ready.then(()=>{const h=document.querySelector('h1');const w=h.scrollWidth;const s=Math.min(200,200*1080/w);h.style.fontSize=s+'px';h.style.top=(document.body.classList.contains('basso')?521-s*.83:330-s*.62)+'px';document.body.dataset.ok=1})</script>`;
  const tmp = join(TMP, `${p.file}.html`);
  writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href);
  await page.waitForSelector('body[data-ok]');
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(ROOT, `assets/og/${p.file}.jpg`), type: 'jpeg', quality: 86 });
  console.log('og', p.file);
}

// icone: "Z" in Bodoni avorio su inchiostro
for (const [size, nome] of solo.length ? [] : [[32, 'favicon-32.png'], [192, 'favicon-192.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewportSize({ width: size, height: size });
  const r = nome.startsWith('apple') ? 0 : Math.round(size * 0.18);
  const html = `<!doctype html><meta charset="utf-8"><style>${font}*{margin:0}html,body{width:${size}px;height:${size}px;background:transparent}
  div{width:${size}px;height:${size}px;border-radius:${r}px;background:#15120F;display:grid;place-items:center;color:#F6F1E8;font:500 ${Math.round(size * 0.78)}px/1 B;padding-bottom:${Math.round(size * 0.04)}px}</style><div>Z</div>
  <script>document.fonts.ready.then(()=>document.body.dataset.ok=1)</script>`;
  const tmp = join(TMP, nome + '.html');
  writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href);
  await page.waitForSelector('body[data-ok]');
  await page.screenshot({ path: join(ROOT, `assets/icone/${nome}`), omitBackground: true });
  console.log('icona', nome);
}
await browser.close();
