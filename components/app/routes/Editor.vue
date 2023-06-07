<script setup lang="ts">
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'

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
   <EditorToolbar />
</template>
