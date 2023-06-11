<script setup lang="ts">
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import Preview from '@/components/shared/Preview.vue'

import { useEditorQuery } from '@/lib/useEditorQuery'
import { useStore } from '@/lib/store'
import { getFamily } from '@/lib/fonts'
import { db } from '@/lib/db'
import { injectFonts } from '@/lib/injectFonts'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

import type { DBCombination } from '@/types/db'

const store = useStore()
const route = useRoute()

// 1. At this point the entry is 100% in the DB (route guard in index.ts)
const entry = (await db.get(route.params.id as string)) as DBCombination
store.editor.actions.setCurrentEntry(entry)

/**
 * 2. Always set the query on mount, if invalid, either restore it
 * from the store (prev/next navigation) or set the default value
 *
 * This will also register watchers to update it
 */
await useEditorQuery()

// 3. Fetch Google fonts and set them to store using the current sort criteria
try {
   await store.fonts.actions.fetchAndSetFonts(store.editor.sortCriteriaModel)
} catch (error) {
   console.log(error)
   throw new Error(`[editor-route-store-fonts] - ${APP_CRITICAL_ERROR}`)
}

// 4. Inject fonts for preview, on initial mount they are equal to assigned fonts
try {
   const previewFamilies = []

   const headlineFamily = getFamily(store.fonts.data.value!, store.preview.headlineFont.family)
   const bodyFamily = getFamily(store.fonts.data.value!, store.preview.bodyFont.family)

   previewFamilies.push(headlineFamily, bodyFamily)

   await injectFonts(previewFamilies)
} catch (error) {
   console.log(error)
   throw new Error(`[editor-route-preview-fonts] - ${APP_CRITICAL_ERROR}`)
}

// 5. Inject the first 15 fonts for the explorer
try {
   const first15Fonts = store.editor.activeFontsComputed.slice(0, 15)
   await injectFonts(first15Fonts)
} catch (error) {
   console.log(error)
   throw new Error(`[editor-route-editor-fonts] - ${APP_CRITICAL_ERROR}`)
}
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
         <Preview />
      </template>
   </ContentLayout>
</template>
