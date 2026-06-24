import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone React + recharts reference app (shadcn chart parity target).
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: { port: 4300, strictPort: true },
});
