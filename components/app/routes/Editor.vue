<script setup lang="ts">
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import Preview from '@/components/shared/Preview.vue'

import { useEditorQuery } from '@/lib/useEditorQuery'
import { useStore } from '@/lib/store'
import { getFamily } from '@/lib/fontUtils'
import { injectEditorFonts } from '@/lib/injectFonts'
import { VueAppCriticalError } from '@/lib/utils'

const store = useStore()

/**
 * 2. Always set the query on mount, if invalid, either restore it
 * from the store (prev/next navigation) or set the default value
 *
 * This also registers watchers to update it
 */
await useEditorQuery()

// 3. Fetch Google fonts and set them to store using the current sort criteria if first visit
if (!store.fonts.data.value) {
   await store.fonts.actions.fetchAndSetFonts(store.editor.sortCriteriaModel)
}
if (!store.fonts.data.value) {
   throw VueAppCriticalError('[editor-route-store-fonts] - No fonts in store!')
}

// 4. Inject fonts for preview, on initial mount they are equal to assigned fonts
try {
   const headlineFamily = getFamily(store.fonts.data.value, store.preview.headlineFont.family)
   const bodyFamily = getFamily(store.fonts.data.value, store.preview.bodyFont.family)

   await injectEditorFonts([headlineFamily, bodyFamily])
} catch (error) {
   console.error(error)
   throw VueAppCriticalError('[editor-route-preview-fonts] - Failed injecting preview fonts!')
}

// 5. Inject the first 15 fonts for the explorer
try {
   const first15Fonts = store.editor.activeFontsComputed.slice(0, 15)
   await injectEditorFonts(first15Fonts)
} catch (error) {
   console.error(error)
   throw VueAppCriticalError('[editor-route-explorer-fonts] - Failed injecting explorer fonts!')
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
