<script setup lang="ts">
import { db } from '@/lib/db'

import Preview from '@/components/shared/Preview.vue'
import ContentLayout from '@/components/shared/ContentLayout.vue'
import CombinationListHeader from '@/components/shared/CombinationListHeader.vue'
import CombinationListCreate from '@/components/shared/CombinationListCreate.vue'
import CombinationListEntry from '@/components/shared/CombinationListEntry.vue'

import { APP_CRITICAL_ERROR, SORT_CRITERIA } from '@/lib/constants'
import { getMemoryOrDBInstanceKey, injectFontFace, injectedFonts } from '@/lib/injectFonts'
import { getFamily } from '@/lib/fonts'
import { useStore } from '@/lib/store'

import type { DBCombination } from '@/types/db'
import { reloadPage } from '@/lib/utils'

const entries = await db.getAll()
if (!entries) {
   throw new Error(`[combination-list-view] - Failed fetching combinations! ${APP_CRITICAL_ERROR}`)
}

const route = useRoute()
const router = useRouter()
const store = useStore()

const combinations = ref<DBCombination[]>(entries)
const activeEntry = ref(combinations.value[0])

// 1. Highlight active id from query
try {
   if (route.query.current) {
      const id = route.query.current
      const entry = await db.get(id as string)

      if (entry) {
         const currId = combinations.value.find(({ id: dbId }) => dbId === id)
         if (currId) activeEntry.value = currId
      }
   }
} catch (error) {
   throw new Error(
      `[combination-list-view] - Failed setting latest active ID! ${APP_CRITICAL_ERROR}`
   )
}

// 2. If no fonts in the store (new visit), fetch them. Here we don't care about the sort.
// Just need them for the download URLs.
if (!store.fonts.data.value) await store.fonts.actions.fetchAndSetFonts(SORT_CRITERIA[0].value)
if (!store.fonts.data.value) {
   throw new Error(`[combination-list-view] - Failed fetching fonts! ${APP_CRITICAL_ERROR}`)
}

// 3. Inject fonts and weights needed for the preview
try {
   for (const { headline, body } of combinations.value) {
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

// Events

async function onDelete(id: string) {
   try {
      const newCombinations = combinations.value.filter((entry) => entry.id !== id)
      // If deleting last combination
      if (newCombinations.length === 0) {
         await router.replace({ query: {} }) // Remove query
         await db.remove(id) // Delete it from DB, do not update the UI

         reloadPage() // Route guard will send to first-combination if no combinations left
      } else {
         combinations.value = newCombinations
         await db.remove(id) // Delete in background
      }
   } catch (error) {
      console.error(error) // Do not show error, just log it
   }
}
</script>

<template>
   <CombinationListHeader />

   <ContentLayout>
      <!-- Explorer -->

      <template #explorer>
         <section class="CombinationList_Explorer">
            <h2 class="Section_Title">My Combinations</h2>

            <CombinationListCreate />

            <ul class="CombinationList_Grid">
               <CombinationListEntry
                  v-for="combination in combinations"
                  :key="combination.id"
                  :combination="combination"
                  @delete="onDelete(combination.id)"
               />
            </ul>
         </section>
      </template>

      <!-- Preview -->

      <template #preview>
         <section class="CombinationList_Explorer CombinationList_Preview">
            <div>
               <h2 class="Section_Title Preview_Title">Live Preview</h2>
            </div>
            <Preview />
         </section>
      </template>
   </ContentLayout>
</template>

<style scoped>
.Section_Title {
   font-weight: 700;
   color: var(--fg-headline-color);
   font-size: var(--font-size-4);

   @media (--layout-switch) {
      font-size: var(--font-size-3);
   }
}

@media (--layout-switch) {
   .Preview_Title {
      display: none;
   }
}

.CombinationList_Explorer {
   overflow: auto;
   display: flex;
   flex-direction: column;
}

.CombinationList_Preview {
   min-width: calc(450px + var(--size-8));

   @media (--layout-switch) {
      display: none;
   }
}

.CombinationList_Grid {
   display: grid;
   margin-bottom: var(--size-4);
   overflow: auto;

   @media (--layout-switch) {
      margin-bottom: var(--size-2);
   }

   & > div:last-of-type {
      border: none;
   }
}
</style>
