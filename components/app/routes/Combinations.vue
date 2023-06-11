<script setup lang="ts">
import { APP_CRITICAL_ERROR } from '@/lib/constants'
import { db } from '@/lib/db'
import { useUpdateQuery } from '@/lib/useUpdateQuery'

import NewCombinationView from '@/components/shared/NewCombinationView.vue'
import CombinationListView from '@/components/shared/CombinationListView.vue'

import type { DBCombination } from '@/types/db'

const route = useRoute()
const updateQuery = useUpdateQuery()

const shouldRenderCreateDialog = ref(true)
const combinationsRef = ref<DBCombination[] | null>(null)

function setCombinationsRef(combinations: DBCombination[]) {
   combinationsRef.value = combinations
}

// Check which view to render

try {
   const combinations = await db.getAll()

   if (route.query.new) {
      // Returning user trying to access /combinations?new
      if (combinations && combinations.length > 0) {
         await updateQuery('new', undefined)
         shouldRenderCreateDialog.value = false
         combinationsRef.value = combinations
      } // Else render with default props
   } else {
      // New user trying to access /combinations
      if (!combinations || combinations.length === 0) {
         await updateQuery('new', 'true')
         shouldRenderCreateDialog.value = true
      } else {
         // Returning user trying to access /combinations
         shouldRenderCreateDialog.value = false
         combinationsRef.value = combinations
      }
   }
} catch (error) {
   throw new Error(`[combinations-route-db] - ${APP_CRITICAL_ERROR}`)
}

console.log(combinationsRef.value)
</script>

<template>
   <NewCombinationView v-if="shouldRenderCreateDialog" />
   <CombinationListView
      :combinations="combinationsRef"
      :setCombinations="setCombinationsRef"
      v-else
   />
</template>
