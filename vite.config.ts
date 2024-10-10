import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    ...(process.env.NODE_ENV !== 'test'
      ? [
          remix({
            future: {
              v3_fetcherPersist: true,
              v3_relativeSplatPath: true,
              v3_throwAbortReason: true,
            },
          }),
        ]
      : []),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
