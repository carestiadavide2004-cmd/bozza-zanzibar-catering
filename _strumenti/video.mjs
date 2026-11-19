// Uso: node _strumenti/video.mjs <cartella-lavoro> <cartella-sito>
// I video sorgente 4K vanno scaricati da Pexels in <cartella-lavoro>/src/v<ID>.mp4 (gli ID sono nella tabella E).
// Salta i file già presenti: per rifarne uno, prima spostalo altrove (non cancellare).
// Video hero: loop con dissolvenza invisibile, CFR, H.264, senza audio + poster WebP + clip anteprima card
import { execFile } from 'child_process'; import { promisify } from 'util'; import { existsSync, statSync, mkdirSync } from 'fs';
const run = promisify(execFile);
const [,, S, SITE] = process.argv;
const V = `${SITE}/assets/video`, I = `${SITE}/assets/img/eventi`, T = `${S}/vtmp`; mkdirSync(T, { recursive: true });
// src, inizio, durata, fps, crop orizzontale [w,h,x,y], crop verticale [w,h,x,y], crop card 4:5 [w,h,x,y]
const E = {
  matrimoni:  { id: '37964387', ss: 0.3, L: 11.4, fps: 30, h: [2160,1215,0,1300], v: [2160,3840,0,0],    c: [2160,2700,0,1000] },
  comunioni:  { id: '8769414',  ss: 0.8, L: 9.1, F: 0.5, fps: 25, h: [3840,2160,0,0],    v: [1215,2160,1200,0], c: [1728,2160,1382,0] },
  compleanni: { id: '5617394',  ss: 4.7, L: 9.1, F: 0.6, fps: 25, h: [2560,1440,620,0],  v: [1080,1920,1553,0], c: [1350,1688,1226,0] },
  aziendali:  { id: '8922356',  ss: 11.9, L: 8.2, F: 0.8, fps: 25, h: [3840,2160,128,0],  v: [1215,2160,1990,0], c: [1728,2160,1594,0] },
  aperitivi:  { id: '8531389',  ss: 16,  L: 11,   fps: 25, h: [3840,2160,0,0],    v: [1215,2160,1460,0], c: [1728,2160,1248,0] },
  lauree:     { id: '8530982',  ss: 28.9, L: 10.5, F: 0.6, fps: 25, h: [3840,2160,0,0],   v: [1215,2160,2158,0], c: [1440,1800,1920,0] },
};
const F = 1.0;
function graph(crop, ow, oh, fps, L, f) {
  const [w,h,x,y] = crop;
  return `[0:v]setpts=PTS-STARTPTS,crop=${w}:${h}:${x}:${y},scale=${ow}:${oh}:flags=lanczos,fps=${fps},setsar=1,format=yuv420p,split[a][b];` +
    `[a]trim=start=${f},setpts=PTS-STARTPTS[m];[b]trim=end=${f},setpts=PTS-STARTPTS[h];` +
    `[m][h]xfade=transition=fade:duration=${f}:offset=${(L-2*f).toFixed(3)},format=yuv420p[out]`;
}
async function enc(e, crop, ow, oh, out, L, f, crf, maxrate) {
  if (existsSync(out)) return;
  await run('ffmpeg', ['-nostdin','-v','error','-y','-ss',String(e.ss),'-t',String(L),'-i',`${S}/src/v${e.id}.mp4`,
    '-filter_complex', graph(crop, ow, oh, e.fps, L, f), '-map','[out]','-an',
    '-c:v','libx264','-preset','slow','-crf',String(crf),'-maxrate',maxrate,'-bufsize',String(parseInt(maxrate)*2)+'k',
    '-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-r',String(e.fps),'-fps_mode','cfr','-g',String(e.fps*2),
    '-movflags','+faststart', out], { maxBuffer: 1e8 });
}
async function poster(mp4, outs) { // outs: [[width, file, q]]
  const png = `${T}/${mp4.split('/').pop()}.png`;
  await run('ffmpeg', ['-nostdin','-v','error','-y','-i',mp4,'-frames:v','1',png]);
  for (const [w, f, q] of outs) if (!existsSync(f)) await run('cwebp', ['-quiet','-m','6','-q',String(q||78),'-sharp_yuv','-resize',String(w),'0',png,'-o',f]);
}
const jobs = [];
for (const [k, e] of Object.entries(E)) {
  jobs.push(async () => { const o = `${V}/${k}-orizzontale.mp4`; await enc(e, e.h, 1920, 1080, o, e.L, e.F || F, 23, '3800k');
    await poster(o, [[1920, `${V}/${k}-orizzontale-1920.webp`], [1280, `${V}/${k}-orizzontale-1280.webp`]]); });
  jobs.push(async () => { const o = `${V}/${k}-verticale.mp4`; await enc(e, e.v, 1080, 1920, o, e.L, e.F || F, 23, '3800k');
    await poster(o, [[1080, `${V}/${k}-verticale-1080.webp`], [720, `${V}/${k}-verticale-720.webp`]]); });
  jobs.push(async () => { const o = `${V}/${k}-anteprima.mp4`; await enc(e, e.c, 720, 900, o, 4.6, 0.6, 26, '1600k');
    await poster(o, [[720, `${I}/${k}-card-720.webp`], [480, `${I}/${k}-card-480.webp`], [200, `${I}/${k}-mini-200.webp`, 80]]); });
}
let i = 0; const t0 = Date.now();
await Promise.all(Array.from({ length: 3 }, async () => { while (i < jobs.length) { const j = jobs[i++]; await j(); } }));
for (const k of Object.keys(E)) for (const s of ['orizzontale','verticale','anteprima']) { const f = `${V}/${k}-${s}.mp4`; console.log(k, s, (statSync(f).size/1048576).toFixed(2)+'MB'); }
console.log('tempo', Math.round((Date.now()-t0)/1000)+'s');
