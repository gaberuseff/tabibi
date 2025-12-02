import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Enable additional performance optimizations
  build: {
    // Reduce bundle size by enabling tree shaking
    rollupOptions: {
      output: {
        // Split vendor and app code into separate chunks
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          data: ['@tanstack/react-query', '@supabase/supabase-js'],
          utils: ['lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
  }
})