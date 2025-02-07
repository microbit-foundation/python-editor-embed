import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'python-editor-embed',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'tslib'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
    }),
  ],
});
