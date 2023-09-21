import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Unocss from 'unocss/vite'

const variablesPath = path.resolve(__dirname, './src/styles/variable.less')

// https://vitejs.dev/config/
export default defineConfig({
  // 可以通过 root 参数配置项目根目录的位置
  // root: path.join(__dirname, 'src'),
  plugins: [react(), Unocss()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import '${normalizePath(variablesPath)}';`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
