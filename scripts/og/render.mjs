// Renders scripts/og/og.html to public/og.jpg (1200x630) with local Chrome + sharp.
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const html = resolve('scripts/og/og.html');
const png = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.png');
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, `file://${html}`], { stdio: 'ignore' });
const info = await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og.jpg');
console.log(`public/og.jpg ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
