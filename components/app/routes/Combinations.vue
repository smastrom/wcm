<script setup lang="ts">
import { useStore } from '@/lib/store'
import { fetchFonts } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'
import { APP_CRITICAL_ERROR } from '@/lib/constants'
import { db } from '@/lib/db'

import NewCombinationView from '@/components/shared/NewCombinationView.vue'
import CombinationListView from '@/components/shared/CombinationListView.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const shouldRenderCreateDialog = ref(true)

if (!store.fonts.data.value) {
   try {
      const googleFonts = await fetchFonts()
      if (googleFonts) {
         const appFonts = getFonts(googleFonts)
         store.fonts.actions.setFonts(appFonts)
      }
   } catch (error) {
      throw new Error(`[combinations-route-fonts] - ${APP_CRITICAL_ERROR}`)
   }
}

try {
   const combinations = await db.getAll()

   if (route.query.new) {
      if (combinations && combinations.length > 0) {
         router.replace({ query: { new: undefined } })
         shouldRenderCreateDialog.value = false
      }
   } else {
      if (!combinations || combinations.length === 0) {
         router.replace({ query: { new: 'true' } })
         shouldRenderCreateDialog.value = true
      } else {
         shouldRenderCreateDialog.value = false
      }
   }
} catch (error) {
   throw new Error(`[combinations-route-db] - ${APP_CRITICAL_ERROR}`)
}
</script>

<template>
   <NewCombinationView v-if="shouldRenderCreateDialog" />
   <CombinationListView v-else />
</template>
