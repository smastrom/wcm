import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unimport from 'unimport/unplugin'
import VueMacros from 'unplugin-vue-macros/vite'
import { resolve } from 'path'

export default defineConfig({
   resolve: {
      alias: {
         '@': resolve(__dirname, '.'),
         '@/assets': resolve(__dirname, './assets'),
         '@/components': resolve(__dirname, './components'),
         '@/lib': resolve(__dirname, './lib'),
         '@/types': resolve(__dirname, './types')
      }
   },
   plugins: [
      VueMacros({
         plugins: { vue: vue() },
         defineProp: { edition: 'johnsonEdition' }
      }),
      Unimport.vite({
         dts: true,
         addons: { vueTemplate: true },
         presets: ['vue', 'vue-router'],
         imports: [{ name: 'default', as: 'indexedDB', from: 'localforage' }]
      })
   ]
})
