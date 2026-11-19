// Trova il punto di loop migliore (fotogrammi più simili) in un video.
// Uso: node _strumenti/loopfind.mjs <video.mp4> <durata-min> <durata-max> [crop w:h:x:y]
import { execFileSync } from 'child_process';
const [,, file, minL, maxL, crop] = process.argv; const W = 64, H = 64, FPS = 10;
const vf = (crop ? `crop=${crop},` : '') + `fps=${FPS},scale=${W}:${H},format=gray`;
const buf = execFileSync('ffmpeg', ['-nostdin','-v','error','-i',file,'-vf',vf,'-f','rawvideo','-'], { maxBuffer: 1e9 });
const n = Math.floor(buf.length / (W*H)); const fr = i => buf.subarray(i*W*H, (i+1)*W*H);
const res = [];
for (let i = 0; i < n; i++) for (let j = i + minL*FPS; j <= Math.min(n-1, i + maxL*FPS); j++) {
  const a = fr(i), b = fr(j); let s = 0; for (let k = 0; k < a.length; k++) { const d = a[k]-b[k]; s += d*d; }
  res.push([s/a.length, i/FPS, j/FPS]);
}
res.sort((x,y)=>x[0]-y[0]); console.log(file.split('/').pop(), 'frames', n); console.log(res.slice(0,6).map(r=>`mse ${r[0].toFixed(0)} start ${r[1]} end ${r[2]} L ${(r[2]-r[1]).toFixed(1)}`).join('\n'));
