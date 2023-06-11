<script setup lang="ts">
import ContentLayout from './ContentLayout.vue'
import CombinationListHeader from './CombinationListHeader.vue'
import Preview from './Preview.vue'

import { useUpdateQuery } from '@/lib/useUpdateQuery'
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
import { getMemoryOrDBInstanceKey, injectedFonts, injectFontFace } from '@/lib/injectFonts'
import { getFamily } from '@/lib/fonts'
import { APP_CRITICAL_ERROR, SORT_CRITERIA } from '@/lib/constants'

import type { DBCombination } from '@/types/db'

const props = defineProps<{ combinations: DBCombination[] }>()

const store = useStore()
const route = useRoute()

const updateQuery = useUpdateQuery()

/**
 * When entering here we are 100% sure that the user has at least one combination in the DB.
 * if in the query there's a combination ID we set it in the preview and highlight it in the list.
 * If not, we highlight the latest.
 */

const combinationsRef = toRef(props, 'combinations') // Already sorted by last updated

const activeEntry = ref(combinationsRef.value[0])

// 1. Handle restore from query

try {
   if (route.query.current) {
      const id = route.query.current
      const entry = await db.get(id as string)

      if (!entry) {
         await updateQuery('current', undefined)
      } else {
         const findId = combinationsRef.value.find(({ id: dbId }) => dbId === id)
         if (findId) activeEntry.value = findId
      }
   }
} catch (error) {
   throw new Error(
      `[combination-list-view] - Failed setting latest active ID! ${APP_CRITICAL_ERROR}`
   )
}

// 2. If no fonts in the store (new visit), fetch them. Here we don't care about the sort
if (!store.fonts.data.value) await store.fonts.actions.fetchAndSetFonts(SORT_CRITERIA[0].value)
if (!store.fonts.data.value) {
   throw new Error(`[combination-list-view] - Failed fetching fonts! ${APP_CRITICAL_ERROR}`)
}

for (const { headline, body } of combinationsRef.value) {
   for (const { family, weight } of [headline, body]) {
      const key = getMemoryOrDBInstanceKey(family, weight)

      // 1. Exit if in memory
      if (injectedFonts.has(key)) continue

      // 3. Fetch from DB / Google
      const fontUrl = getFamily(store.fonts.data.value, family).files[weight]
      const buffer = await db.getFontBuffer(key, fontUrl)

      // 4. Inject FontFace
      await injectFontFace({
         key,
         family,
         weight,
         buffer
      })
   }
}

// 5. Set current preview fonts
store.preview.actions.setBodyFont(activeEntry.value.body)
store.preview.actions.setHeadlineFont(activeEntry.value.headline)
</script>

<template>
   <div>
      <CombinationListHeader />
      <ContentLayout>
         <!-- Combination List -->

         <template #explorer>
            <div>
               <div></div>
               <h2 class="Preview_Title">My Combinations</h2>

               <button class="Global_ActionButton" @click="">Create Combination</button>
            </div>
         </template>

         <!-- Preview -->

         <template #preview>
            <div>
               <div>
                  <h2 class="Preview_Title">
                     <span>Previewing</span>
                     <span class="Preview_Divider" />
                     <span class="Preview_CombinationName">Combination Name</span>
                  </h2>
               </div>
               <Preview />
            </div>
         </template>
      </ContentLayout>
   </div>
</template>

<style scoped>
.Preview_Title {
   font-weight: 700;
   color: var(--fg-headline-color);
   font-size: var(--font-size-4);
   margin-bottom: var(--size-4);
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: var(--size-2);
   flex-wrap: wrap;
}

.Preview_CombinationName {
   color: var(--fg-secondary-color);
   font-weight: 400;
   font-size: var(--font-size-1);
}
</style>
