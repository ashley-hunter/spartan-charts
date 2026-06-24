import { defineConfig } from '@playwright/test';

/**
 * Visual-diff harness: captures our chart and shadcn's, pixel-diffs them.
 * Requires the docs dev server running on http://localhost:4200.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  retries: 0,
  reporter: [['list']],
  use: {
    headless: true,
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
  },
});
