import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unimport from 'unimport/unplugin'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
   resolve: {
      alias: {
         '@': '.',
         '@/assets': './assets',
         '@/components': './components'
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
