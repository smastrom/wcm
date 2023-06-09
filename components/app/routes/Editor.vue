<script setup lang="ts">
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import LivePreview from '@/components/shared/LivePreview.vue'

import { useEditorQuery } from '@/lib/useEditorQuery'
import { useStore } from '@/lib/store'
import { fetchFonts } from '@/lib/fetch'
import { db } from '@/lib/db'
import { getFonts } from '@/lib/fonts'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

import type { DBCombination } from '@/types/db'

const store = useStore()
const route = useRoute()

if (!store.fonts.data.value) {
   try {
      // TODO: Create store action that does this stuff and uses the sort criteria from the query passed as param
      const googleFonts = await fetchFonts(store.editor.sortCriteriaModel)
      if (googleFonts) {
         const appFonts = getFonts(googleFonts)
         store.fonts.actions.setFonts(appFonts)
      }
   } catch (error) {
      throw new Error(`[edtior-route-fonts] - ${APP_CRITICAL_ERROR}`)
   }
}

const entry = (await db.get(route.params.id as string)) as DBCombination
store.editor.actions.setCurrentEntry(entry)

useEditorQuery()
</script>

<template>
   <EditorHeader />
   <ContentLayout>
      <template #toolbar>
         <EditorToolbar />
      </template>

      <template #explorer>
         <EditorExplorer />
      </template>

      <template #preview>
         <LivePreview />
      </template>
   </ContentLayout>
</template>
