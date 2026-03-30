import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

export default defineConfig({
  /**
   * Use a relative base so the bundle works both locally and when
   * published under the GitHub Pages subpath.
   */
  base: './',
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
