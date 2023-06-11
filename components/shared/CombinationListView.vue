<script setup lang="ts">
import ContentLayout from './ContentLayout.vue'
import CombinationListHeader from './CombinationListHeader.vue'
import CombinationListEntry from './CombinationListEntry.vue'
import Preview from './Preview.vue'

import { useUpdateQuery } from '@/lib/useUpdateQuery'
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
import { getMemoryOrDBInstanceKey, injectedFonts, injectFontFace } from '@/lib/injectFonts'
import { getFamily } from '@/lib/fonts'
import { APP_CRITICAL_ERROR, SORT_CRITERIA } from '@/lib/constants'

import type { DBCombination } from '@/types/db'
import { reloadPage } from '@/lib/utils'

const props = defineProps<{
   combinations: DBCombination[]
   setCombinations: (combinations: DBCombination[]) => void
}>()

const store = useStore()
const route = useRoute()
const router = useRouter()

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

// 2. If no fonts in the store (new visit), fetch them. Here we don't care about the sort,
// We just need the URLs to download them from Google.
if (!store.fonts.data.value) await store.fonts.actions.fetchAndSetFonts(SORT_CRITERIA[0].value)
if (!store.fonts.data.value) {
   throw new Error(`[combination-list-view] - Failed fetching fonts! ${APP_CRITICAL_ERROR}`)
}

// 3. Inject fonts and weights needed for any preview
try {
   for (const { headline, body } of combinationsRef.value) {
      for (const { family, weight } of [headline, body]) {
         const key = getMemoryOrDBInstanceKey(family, weight)

         // 1. Exit if in memory
         if (injectedFonts.has(key)) continue

         // 2. Fetch from DB / Google
         const fontUrl = getFamily(store.fonts.data.value, family).files[weight]
         const buffer = await db.getFontBuffer(key, fontUrl)

         // 3. Inject FontFace
         await injectFontFace({ key, family, weight, buffer })
      }
   }
} catch (error) {
   throw new Error(`[combination-list-view] - Failed injecting fonts! ${APP_CRITICAL_ERROR}`)
}

// 5. Set current preview fonts, at this point Suspense resolves
store.preview.actions.setActiveId(activeEntry.value.id)
store.preview.actions.setBodyFont(activeEntry.value.body)
store.preview.actions.setHeadlineFont(activeEntry.value.headline)

// List Entry Events

async function onDelete(id: string) {
   try {
      const newCombinations = combinationsRef.value.filter((entry) => entry.id !== id)
      // If deleting last combination
      if (newCombinations.length === 0) {
         await db.remove(id) // Delete it from DB, do not update the UI
         reloadPage() // Will be redirected to ?new by parent component
      } else {
         props.setCombinations(newCombinations) // Update the UI
         await db.remove(id) // Delete in background
      }
   } catch (error) {
      console.error(error) // Do not show error, just log it
   }
}

async function onCreateClick() {
   try {
      const newEntry = await db.create('ajkhsgdghjasdhjkasdhkjsjhakd')
      store.editor.actions.setCurrentEntry(newEntry)
      await router.push({ name: 'editor', params: { id: newEntry.id } })
   } catch (error) {
      console.error(error)
      throw new Error(`[combination-list-view] - Creation failed. ${APP_CRITICAL_ERROR}`)
   }
}
</script>

<template>
   <div>
      <CombinationListHeader />
      <ContentLayout>
         <!-- Combination List -->

         <template #explorer>
            <div class="CombinationList_Explorer">
               <h2 class="Preview_Title">My Combinations</h2>
               <button class="Global_ActionButton" @click="onCreateClick">
                  Create Combination
               </button>

               <div class="CombinationList">
                  <CombinationListEntry
                     v-for="combination in combinationsRef"
                     :key="combination.id"
                     :combination="combination"
                     @delete="onDelete(combination.id)"
                  />
               </div>
            </div>
         </template>

         <!-- Preview -->

         <template #preview>
            <div class="CombinationList_Explorer">
               <div>
                  <h2 class="Preview_Title">Preview</h2>
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

.CombinationList_Explorer {
   overflow: auto;
   display: flex;
   flex-direction: column;
}

.CombinationList {
   display: grid;
   margin-bottom: var(--size-4);
   overflow: auto;
}
</style>
