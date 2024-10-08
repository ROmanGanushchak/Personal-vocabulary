import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@components', replacement: '/src/components' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@api', replacement: '/src/api.js' },
      { find: '@api_un', replacement: '/src/anauthorizedApi.js' },
      { find: '@images', replacement: '/src/images' },
      { find: '@logos', replacement: '/src/images/logos' },
      { find: '@hooks', replacement: '/src/hooks'}
    ],
  },
})
