import { db } from './db'
import { useStore } from './store'

import type { Router } from 'vue-router'

export function setRouteGuards(router: Router) {
   router.beforeEach(async (to, from) => {
      if (to.name === from.name) return true

      const store = useStore()

      if (to.name === 'editor') {
         const entry = await db.get(to.params.id as string)

         if (entry) {
            store.editor.actions.setCurrentEntry(entry)
            return true
         }
         console.error('[editor-route-guard] - @beforeEach - Invalid param!')
         return { name: 'combinations' }
      }

      if (to.name === 'combinations') {
         const entries = await db.getAll()
         const isNewUser = !entries || entries.length === 0

         if (isNewUser) {
            return { name: 'first-combination' }
         }

         store.combinations.actions.setCombinations(entries)
         return true
      }

      if (to.name === 'first-combination') {
         const entries = await db.getAll()
         const isReturningUser = entries && entries.length > 0

         if (isReturningUser) {
            return { name: 'combinations' }
         }
         return true
      }
   })

   router.afterEach(async (to, from) => {
      if (to.name === from.name) return true

      if (from.name === 'editor') {
         const store = useStore()
         store.editor.actions.resetCurrentEntry()
      }
   })
}
