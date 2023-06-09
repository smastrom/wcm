<script setup lang="ts">
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import Preview from '@/components/shared/Preview.vue'

import { useEditorQuery } from '@/lib/useEditorQuery'
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
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
 * This will also register watcher to update it
 */
await useEditorQuery()

// 3. Fetch Google fonts and replace them to store using the current sort criteria
try {
   store.fonts.actions.fetchAndSetFonts(store.editor.sortCriteriaModel)
} catch (error) {
   throw new Error(`[edtior-route-fonts] - ${APP_CRITICAL_ERROR}`)
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
