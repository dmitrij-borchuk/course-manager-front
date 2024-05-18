import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ['@emotion/react', '@emotion/styled', '@mui/material/Unstable_Grid2/Grid2'],
  // },
  // plugins: [
  //   react({
  //     jsxImportSource: '@emotion/react',
  //     babel: {
  //       plugins: ['@emotion/babel-plugin'],
  //     },
  //   }),
  // ],
  envPrefix: 'REACT_APP_',
  resolve: {
    alias: {
      // Before we have used `react-scripts` and `craco` and set up `root` in `tsconfig`
      // but it doesn't work with Vite, so we need to set up aliases manually
      hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      store: fileURLToPath(new URL('./src/store', import.meta.url)),
      config: fileURLToPath(new URL('./src/config', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      modules: fileURLToPath(new URL('./src/modules', import.meta.url)),
      hocs: fileURLToPath(new URL('./src/hocs', import.meta.url)),
      api: fileURLToPath(new URL('./src/api', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      services: fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
})
