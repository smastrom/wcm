<script setup lang="ts">
import ContentLayout from '@/components/shared/ContentLayout.vue'
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorExplorer from '@/components/shared/EditorExplorer.vue'
import EditorToolbar from '@/components/shared/EditorToolbar.vue'
import LivePreview from '@/components/shared/LivePreview.vue'

import { fetchFonts } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'
import { db } from '@/lib/db'
import { useStore } from '@/lib/store'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

import type { DBCombination } from '@/types/db'

const store = useStore()
const route = useRoute()

// Route guard in index.ts, when user enters the page id exists in db 100% and is a returning user
const entry = (await db.get(route.params.id as string)) as DBCombination

// If returning user, get the fonts from Google
if (!store.fonts.data.value) {
   try {
      const googleFonts = await fetchFonts()
      if (googleFonts) {
         const appFonts = getFonts(googleFonts)
         store.fonts.actions.setFonts(appFonts)
      }
   } catch (error) {
      throw new Error(`[edtior-route-fonts] - ${APP_CRITICAL_ERROR}`)
   }
}

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
