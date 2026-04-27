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
    host: true, // 0.0.0.0 바인딩 — 같은 LAN의 모바일에서도 PC IP로 접속 가능
    proxy: {
      // /api 로 시작하는 요청은 백엔드(Spring Boot 9000)로 전달
      // → 브라우저 입장에선 동일 오리진이라 CORS 문제 없음
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      // 업로드된 이미지(/uploads/*)도 백엔드 정적 리소스로 프록시
      '/uploads': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})
