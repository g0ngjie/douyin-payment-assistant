import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
    target: 'esnext',
    minify: 'terser',
    lib: {
      name: 'webui',
      formats: ['umd'],
      entry: 'src/index.js',
      fileName: 'webui',
    }
  },
  define: {
    'process.env': {}
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
})
