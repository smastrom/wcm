<script setup lang="ts">
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import LivePreview from '@/components/shared/LivePreview.vue'

import { db } from '@/lib/db'
import { useStore } from '@/lib/store'

import type { DBCombination } from '@/types/db'

const store = useStore()
const route = useRoute()

// Route guard in index.ts, when user enters the page id exists in db 100%
const entry = (await db.get(route.params.id as string)) as DBCombination

// Populate store with entry from DB
store.editor.actions.setCurrentEntry(entry)
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
