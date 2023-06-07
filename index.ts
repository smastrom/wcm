import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { storeInjectionKey, createStore } from '@/lib/store'
import { db } from '@/lib/db'

import App from '@/components/app/App.vue'
import IndexPage from '@/components/app/routes/Index.vue'
import CombinationsPage from '@/components/app/routes/Combinations.vue'
import EditorPage from '@/components/app/routes/Editor.vue'

import '@/assets/css/preflight.css'
import '@/assets/css/global.css'
import '@/assets/css/open-props.css'
import '@/assets/css/fonts.css'
import '@/assets/css/rules.css'

db.config()

const app = createApp(App)

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: '/',
         component: IndexPage,
         name: 'index'
      },
      {
         path: '/combinations',
         component: CombinationsPage,
         name: 'combinations'
      },
      {
         path: '/combinations/:id',
         component: EditorPage,
         name: 'editor'
      },
      {
         path: '/:pathMatch(.*)*',
         name: '404',
         redirect: { name: 'index' }
      }
   ]
})

router.beforeEach(async (to) => {
   if (to.name === 'editor') {
      const isValidParam = await db.get(to.params.id as string)
      if (!isValidParam) return router.push({ name: 'combinations' })
   }
})

app.use(router)
app.provide(storeInjectionKey, createStore())
app.mount('#app')
