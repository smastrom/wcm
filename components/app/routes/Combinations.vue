<script setup lang="ts">
import Preview from '@/components/shared/Preview.vue'
import ContentLayout from '@/components/shared/ContentLayout.vue'
import CombinationListHeader from '@/components/shared/CombinationListHeader.vue'
import CombinationListCreate from '@/components/shared/CombinationListCreate.vue'
import CombinationListEntry from '@/components/shared/CombinationListEntry.vue'

import { db } from '@/lib/db'
import { SORT_CRITERIA } from '@/lib/constants'
import { getMemoryOrDBInstanceKey, injectFontFace, injectedFonts } from '@/lib/injectFonts'
import { getFamily } from '@/lib/fontUtils'
import { useStore } from '@/lib/store'
import { VueAppCriticalError } from '@/lib/utils'

const route = useRoute()
const store = useStore()

if (!store.combinations.data.value) throw new Error(`[combination-list-view] - No combinations!`)

const activeEntry = ref(store.combinations.data.value[0])

// 1. Highlight active id from query
try {
   if (route.query.current) {
      const id = route.query.current
      const entry = await db.get(id as string)

      if (entry) {
         const currEntry = store.combinations.data.value.find(({ id: dbId }) => dbId === id)
         if (currEntry) activeEntry.value = currEntry
      }
   }
} catch (error) {
   throw VueAppCriticalError('[combination-list-view] - Failed setting latest active ID!')
}

// 2. If no fonts in the store (new visit), fetch them. Here we don't care about the sort.
// Just need them for the download URLs.
if (!store.fonts.data.value) await store.fonts.actions.fetchAndSetFonts(SORT_CRITERIA[0].value)
if (!store.fonts.data.value) {
   throw VueAppCriticalError('[combination-list-view] - Failed fetching fonts!')
}

// 3. Inject fonts and weights needed for the preview
try {
   for (const { headline, body } of store.combinations.data.value) {
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
   throw VueAppCriticalError('[combination-list-view] - Failed injecting fonts!')
}

// 5. Set current preview fonts, at this point Suspense resolves

store.preview.actions.setActiveId(activeEntry.value.id)
store.preview.actions.setBodyFont(activeEntry.value.body)
store.preview.actions.setHeadlineFont(activeEntry.value.headline)
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
                  v-for="combination in store.combinations.data.value"
                  :key="combination.id"
                  :combination="combination"
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

   & > li:last-of-type {
      border: none;
   }
}
</style>
