import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
   resolve: {
      alias: {
         '@': '.',
         '@/assets': './assets',
         '@/components': './components'
      }
   },
   plugins: [vue()]
})
