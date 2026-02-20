import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions
    })
  ],
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  }
})
