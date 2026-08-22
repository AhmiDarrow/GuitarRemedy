/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Real chunk split so mobile/desktop don't pay full parse cost up front.
        // NO catch-all vendor bucket: basic-pitch/tfjs is only reachable via a
        // genuine dynamic import (basicPitchAssist), so it must stay in its own
        // async chunk loaded only when the user converts audio. A catch-all
        // bucket here would force it eager and double initial parse cost.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (
            /[\\/]node_modules\/(react|react-dom|react-router|react-router-dom|@remix-run|scheduler|react-is|zustand|clsx)[\\/]/.test(
              id,
            )
          ) {
            return 'vendor-react'
          }
          if (/[\\/]node_modules\/(tone|@tonejs)[\\/]/.test(id)) {
            return 'vendor-audio'
          }
          if (/[\\/]node_modules\/(lucide-react)[\\/]/.test(id)) {
            return 'vendor-ui'
          }
          return undefined
        },
      },
    },
    // The async Basic Pitch chunk (@tensorflow/tfjs, ~1.5 MB) legitimately
    // exceeds the default 500 kB warning; it loads only on Upload convert.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
