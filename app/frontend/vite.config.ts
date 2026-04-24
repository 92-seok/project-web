import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // /api 로 시작하는 요청은 백엔드(Spring Boot 9000)로 전달
      // → 브라우저 입장에선 동일 오리진이라 CORS 문제 없음
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})
