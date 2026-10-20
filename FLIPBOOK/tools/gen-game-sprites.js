/*
 * Rebuild MONEY CATCH MANIA's currency sprites FROM the book's own artwork.
 *
 * WHY THIS EXISTS
 * ---------------
 * The book and the game show the same ten denominations, and a child moves
 * straight from one to the other (story page 28 opens the game in an iframe).
 * The money therefore has to be the SAME money in both. It was not: the built
 * game carried its own art, and the 10-paise and 20-paise coins were different
 * designs altogether — a stylised illustration and a differently-struck coin
 * against the book's photographs.
 *
 * assets/Currency/ is the single source of truth. This script re-derives the
 * game's ten sprites from it and re-inlines them into bundle/app-*.js, so the
 * two are matched by construction rather than by hand.
 *
 * WHY IT RE-INLINES INSTEAD OF POINTING THE GAME AT assets/Currency/
 *   • The masters are print-sized (the notes are ~2018px wide, 1.8 MB for the
 *     ten). The game never draws a note wider than 150 design px, so shipping
 *     the masters to it would cost ~7x the bytes for pixels no one can see.
 *   • Vite inlined every asset (assetsInlineLimit), which is what makes the game
 *     folder self-contained: it fetches no image or sound at runtime. Fetching
 *     across into ../FLIPBOOK/ would give that up and add a file:// failure mode.
 *
 * WHAT IT DOES TO EACH MASTER
 *   1. trims the fully-transparent margin (the masters are padded; the game
 *      fits each sprite into a box, so padding would shrink the note on screen)
 *   2. scales down with lanczos to ~3x the largest size the game ever draws it
 *   3. re-encodes WebP q92 with the alpha channel intact
 *   4. splices the base64 back over the old data URI in the bundle
 *
 * USAGE   node tools/gen-game-sprites.js .           (from FLIPBOOK/)
 *         node tools/gen-game-sprites.js . --dry     inspect without writing
 * Needs ffmpeg on PATH. Re-run tools/gen-manifest.js afterwards — the bundle's
 * byte size changes and the loading bar weights itself by it.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = process.argv[2] || '.';
const DRY = process.argv.includes('--dry');
const CURRENCY = path.join(ROOT, 'assets', 'Currency');
const GAME = path.join(ROOT, '..', 'MONEY CATCH MANIA');

// game sprite key → master in assets/Currency/, plus the target long edge.
//
// The game draws a note inside a q(150)x q(96) box and a coin at q(88) on the
// geometric mean of its sides (see _createItem in the bundle), where q() maps
// the 1280x720 design space onto the canvas. 150/1280 of the width is ~300
// physical px on a 2560px screen, so ~460px of source is comfortably past
// what any display can resolve, with room for the sprite's catch-pop tween.
const SPRITES = [
  { key: 'coin_10p', master: 'coin-10-paise.webp', edge: 330 },
  { key: 'coin_20p', master: 'coin-20-paise.webp', edge: 330 },
  { key: 'coin_25p', master: 'coin-25-paise.webp', edge: 330 },
  { key: 'coin_50p', master: 'coin-50-paise.webp', edge: 330 },
  { key: 'note_10', master: 'note-10.webp', edge: 460 },
  { key: 'note_20', master: 'note-20.webp', edge: 460 },
  { key: 'note_50', master: 'note-50.webp', edge: 460 },
  { key: 'note_100', master: 'note-100.webp', edge: 460 },
  { key: 'note_200', master: 'note-200.webp', edge: 460 },
  { key: 'note_500', master: 'note-500.webp', edge: 460 },
];

const ff = (args) => execFileSync('ffmpeg', args, { maxBuffer: 1 << 28 });

function probe(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,pix_fmt', '-of', 'csv=p=0', file],
    { encoding: 'utf8' }).trim().split(',');
  return { w: +out[0], h: +out[1], pix: out[2] };
}

/* Bounding box of everything that is not fully transparent. The masters carry a
 * transparent margin of a few percent; the game fits sprites into a box, so the
 * margin would come straight off the drawn size of the note. */
function alphaBox(file, w, h) {
  const raw = ff(['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    const row = y * w * 4;
    for (let x = 0; x < w; x++) {
      if (raw[row + x * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return { x: 0, y: 0, w, h };            // no alpha at all
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function encode(src, box, edge, hasAlpha, dst) {
  const scale = box.w >= box.h ? `${edge}:-1` : `-1:${edge}`;
  ff(['-y', '-v', 'error', '-i', src,
    '-vf', `crop=${box.w}:${box.h}:${box.x}:${box.y},scale=${scale}:flags=lanczos`,
    '-c:v', 'libwebp', '-lossless', '0', '-quality', '92',
    '-compression_level', '6', '-preset', 'picture',
    '-pix_fmt', hasAlpha ? 'yuva420p' : 'yuv420p',
    '-map_metadata', '-1', '-frames:v', '1', dst]);
}

/* ── the built bundle ─────────────────────────────────────────────────────── */
const bundleFile = fs.readdirSync(path.join(GAME, 'bundle')).find((f) => /^app-.*\.js$/.test(f));
if (!bundleFile) throw new Error(`no app-*.js in ${path.join(GAME, 'bundle')}`);
const bundlePath = path.join(GAME, 'bundle', bundleFile);
let bundle = fs.readFileSync(bundlePath, 'utf8');
const before = Buffer.byteLength(bundle);

// Vite emits `const <id>="data:image/webp;base64,..."` per inlined file and then
// the loader's key→id map: `Oe={coin_20p:te,coin_25p:ee,...}`. Minified ids are
// not stable across builds, so read the map rather than assuming names.
const idOf = {};
for (const m of bundle.matchAll(/([A-Za-z0-9_$]+)=\{((?:[A-Za-z0-9_$]+:[A-Za-z0-9_$]+,?)+)\}/g)) {
  const pairs = m[2].split(',').map((p) => p.split(':'));
  if (pairs.some(([k]) => k === 'note_500') && pairs.some(([k]) => k === 'coin_10p')) {
    for (const [k, v] of pairs) idOf[k] = v;
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gamesprites-'));
let oldTotal = 0, newTotal = 0;

for (const s of SPRITES) {
  const id = idOf[s.key];
  if (!id) throw new Error(`bundle has no asset-map entry for "${s.key}"`);

  const src = path.join(CURRENCY, s.master);
  const meta = probe(src);
  const box = alphaBox(src, meta.w, meta.h);
  const dst = path.join(tmp, `${s.key}.webp`);
  encode(src, box, s.edge, /a/.test(meta.pix), dst);

  const b64 = fs.readFileSync(dst).toString('base64');
  const out = probe(dst);

  // Replace this id's data URI only, and insist on exactly one hit — a silent
  // 0 or 2 would mean the bundle shape changed and the splice is unsafe.
  const re = new RegExp(`(\\b${id.replace(/\$/g, '\\$')}=")data:image/[a-z]+;base64,([A-Za-z0-9+/=]+)(")`, 'g');
  const hits = [...bundle.matchAll(re)];
  if (hits.length !== 1) throw new Error(`${s.key}: expected 1 data URI for id "${id}", found ${hits.length}`);
  oldTotal += hits[0][2].length;
  newTotal += b64.length;
  bundle = bundle.replace(re, `$1data:image/webp;base64,${b64}$3`);

  console.log(`${s.key.padEnd(10)} ${s.master.padEnd(20)} ${meta.w}x${meta.h}` +
    ` -> trim ${box.w}x${box.h} -> ${out.w}x${out.h}` +
    `  ${String(fs.statSync(dst).size).padStart(6)}B  (was b64 ${hits[0][2].length}, now ${b64.length})`);
}

fs.rmSync(tmp, { recursive: true, force: true });

const after = Buffer.byteLength(bundle);
console.log(`\nbase64 payload ${oldTotal} -> ${newTotal} chars`);
console.log(`${bundleFile}: ${before} -> ${after} bytes (${after > before ? '+' : ''}${after - before})`);

if (DRY) { console.log('\n--dry: bundle NOT written.'); process.exit(0); }
fs.writeFileSync(bundlePath, bundle);
console.log('bundle written. Now run: node tools/gen-manifest.js .');
