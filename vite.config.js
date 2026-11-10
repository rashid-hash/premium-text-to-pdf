import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // includeAssets লাইনটি আপাতত মুছে দিয়েছি
      manifest: {
        name: 'Pro Exam Maker',
        short_name: 'ExamMaker',
        description: 'Premium PDF Exam Generator',
        theme_color: '#0f172a',
        background_color: '#0a0a0f',
        display: 'standalone',
        start_url: '/', // এটি নিশ্চিত করবে অ্যাপটি কোথা থেকে শুরু হবে
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})