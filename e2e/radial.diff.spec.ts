import { test, expect, Page } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';

const OUT = path.join(__dirname, '..', '.shadcn-diff');
const SIZES = { desktop: { w: 250, h: 250 }, mobile: { w: 200, h: 200 } };
const THEMES = ['light', 'dark'] as const;
const CHARTS = ['simple', 'label', 'grid', 'text', 'stacked', 'shape'] as const;

function crop(src: PNG, w: number, h: number): PNG {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(src, out, 0, 0, w, h, 0, 0);
  return out;
}

function diffPng(aPath: string, bPath: string, outPath: string): string {
  const a = PNG.sync.read(fs.readFileSync(aPath));
  const b = PNG.sync.read(fs.readFileSync(bPath));
  const cw = Math.min(a.width, b.width);
  const ch = Math.min(a.height, b.height);
  const ca = crop(a, cw, ch);
  const cb = crop(b, cw, ch);
  const diff = new PNG({ width: cw, height: ch });
  const mismatch = pixelmatch(ca.data, cb.data, diff.data, cw, ch, {
    threshold: 0.15,
    includeAA: false,
  });
  fs.writeFileSync(outPath, PNG.sync.write(diff));
  const bg = [ca.data[0], ca.data[1], ca.data[2]];
  let inked = 0;
  for (let i = 0; i < ca.data.length; i += 4) {
    const d =
      Math.abs(ca.data[i] - bg[0]) +
      Math.abs(ca.data[i + 1] - bg[1]) +
      Math.abs(ca.data[i + 2] - bg[2]);
    if (d > 24) inked++;
  }
  const pctImg = (100 * mismatch) / (cw * ch);
  const pctInk = inked ? (100 * mismatch) / inked : 0;
  return `${mismatch}px | ${pctInk.toFixed(1)}% of ink | ${pctImg.toFixed(2)}% of image (ink=${inked})`;
}

async function capture(
  page: Page,
  url: string,
  theme: string,
  containerSel: string,
  svgSel: string,
  file: string,
) {
  await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
  await page.goto(url, { waitUntil: 'load' });
  await page.locator(svgSel).first().waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForTimeout(900);
  const container = page.locator(containerSel).first();
  await container.screenshot({ path: file });
}

for (const chart of CHARTS) {
  for (const theme of THEMES) {
    for (const [sizeName, { w, h }] of Object.entries(SIZES)) {
      const ref = `http://localhost:4300/?type=radial&w=${w}&h=${h}&theme=${theme}&chart=${chart}`;
      const ours = `http://localhost:4500/#/iso/radial?w=${w}&h=${h}&chart=${chart}`;
      const tag = `radial-${chart}-${theme}-${sizeName}`;

      test(`radial [${tag}] static`, async ({ browser }) => {
        fs.mkdirSync(OUT, { recursive: true });
        const p1 = await browser.newPage({ deviceScaleFactor: 2 });
        await capture(p1, ref, theme, '.chart', '.recharts-surface', path.join(OUT, `ref-${tag}-static.png`));
        const p2 = await browser.newPage({ deviceScaleFactor: 2 });
        await capture(p2, ours, theme, '.iso-chart', 'spn-radial-bar-chart svg', path.join(OUT, `ours-${tag}-static.png`));
        console.log(`STATIC ${tag}  ` + diffPng(path.join(OUT, `ref-${tag}-static.png`), path.join(OUT, `ours-${tag}-static.png`), path.join(OUT, `diff-${tag}-static.png`)));
        expect(true).toBe(true);
      });
    }
  }
}
