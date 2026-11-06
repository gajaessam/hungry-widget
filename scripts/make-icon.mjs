// 외부 이미지 없이 주먹밥 아이콘(assets/icon.png)을 직접 그린다.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZE = 256;
const SAMPLES = 4;
const CREAM = [255, 250, 235];
const INK = [59, 47, 42];
const NORI = [47, 62, 58];
const BLUSH = [244, 150, 130];

// 둥근 삼각형까지의 부호 거리. 음수면 도형 안쪽이다.
function riceDistance(x, y) {
  const verts = [[128, 34], [34, 202], [222, 202]];
  const cx = 128, cy = 146, shrink = 0.72;
  const pts = verts.map(([vx, vy]) => [cx + (vx - cx) * shrink, cy + (vy - cy) * shrink]);
  let d = Infinity, inside = true;
  for (let i = 0; i < 3; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 3];
    const ex = bx - ax, ey = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey)));
    d = Math.min(d, Math.hypot(x - ax - ex * t, y - ay - ey * t));
    if ((x - ax) * ey - (y - ay) * ex > 0) inside = false;
  }
  return (inside ? -d : d) - 44;
}

function sample(x, y) {
  const d = riceDistance(x, y);
  if (d > 8) return null;
  if (d > 0) return INK;
  if (x > 92 && x < 164 && y > 168) return NORI;
  if (Math.hypot(x - 100, y - 124) < 9 || Math.hypot(x - 156, y - 124) < 9) return INK;
  if (Math.hypot(x - 82, y - 146) < 11 || Math.hypot(x - 174, y - 146) < 11) return BLUSH;
  const smile = Math.hypot(x - 128, y - 128);
  if (y > 134 && smile > 15 && smile < 21) return INK;
  return CREAM;
}

const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
for (let y = 0; y < SIZE; y++) {
  const row = y * (SIZE * 4 + 1);
  for (let x = 0; x < SIZE; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < SAMPLES; sy++) {
      for (let sx = 0; sx < SAMPLES; sx++) {
        const color = sample(x + (sx + 0.5) / SAMPLES, y + (sy + 0.5) / SAMPLES);
        if (color) { r += color[0]; g += color[1]; b += color[2]; a++; }
      }
    }
    const i = row + 1 + x * 4;
    if (a) {
      raw[i] = r / a; raw[i + 1] = g / a; raw[i + 2] = b / a;
      raw[i + 3] = (a / (SAMPLES * SAMPLES)) * 255;
    }
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // 비트 깊이
ihdr[9] = 6; // RGBA

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'icon.png');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log('wrote', out);
