import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 可以通过 root 参数配置项目根目录的位置
  // root: path.join(__dirname, 'src'),
  plugins: [react()]
})
