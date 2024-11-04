import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // เพิ่ม base สำหรับเส้นทาง asset ที่ถูกต้อง
  preview: {
    host: true,
    port: 5003
  }
})


