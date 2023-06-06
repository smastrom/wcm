import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { storeInjectionKey, createStore } from '@/lib/store'
import { db } from '@/lib/db'

import App from '@/components/app/App.vue'
import IndexPage from '@/components/app/routes/Index.vue'

import '@/assets/css/preflight.css'
import '@/assets/css/global.css'
import '@/assets/css/rules.css'

db.config()

const app = createApp(App)

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: '/',
         component: IndexPage
      }
   ]
})

app.use(router)
app.provide(storeInjectionKey, createStore())
app.mount('#app')
