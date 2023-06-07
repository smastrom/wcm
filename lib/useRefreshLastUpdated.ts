import { db } from './db'
import { useStore } from './store'

export function useRefreshLastUpdated(id: string) {
   const store = useStore()

   let intervalId: number

   async function refreshLastUpdated() {
      const entry = await db.get(id)
      if (!entry) return

      store.editor.actions.setLastUpdated(entry.lastUpdated)
   }

   onMounted(() => {
      intervalId = setInterval(refreshLastUpdated, 60 * 1000) as unknown as number
   })

   onBeforeUnmount(() => clearInterval(intervalId))

   return { lastUpdated: toRef(() => store.editor.lastUpdated) }
}
