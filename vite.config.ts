import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: [
          ['babel-plugin-styled-components', { displayName: true }]
        ]
      }
    })
  ],
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    minifyIdentifiers: false,
    keepNames: true
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'EVAL') return
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          routing: ['react-router-dom'],
          utils: ['axios', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  server: {
    port: 5173,
    host: true,
    open: false,
    cors: true,
    hmr: {
      overlay: false
    }
  },
  preview: {
    port: 4173,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'react-hot-toast',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})
