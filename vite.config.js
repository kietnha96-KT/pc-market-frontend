import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Bất cứ request nào bắt đầu bằng /api sẽ được Vite đẩy sang onrender
      '/api': {
        target: 'https://pcmarket-api.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})