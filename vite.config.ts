import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { execSync } from 'child_process'

const commitHash = execSync('git rev-parse HEAD').toString().trim()

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Required by @react-pdf/renderer
      include: ['buffer', 'process', 'stream', 'util', 'zlib', 'assert'],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(commitHash),
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  },
})
