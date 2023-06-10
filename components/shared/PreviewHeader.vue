<script setup lang="ts">
import { useStore } from '@/lib/store'

import PreviewHeaderBar from './PreviewHeaderBar.vue'
import { DEFAULT_FONTS, DEFAULT_WEIGHTS } from '@/lib/constants'

const hideAssigned = defineProp(false, false)

const store = useStore()

const isDefaultHeadingAssigned = computed(() => {
   if (!store.editor.assignedHeadlineFont) return false

   return (
      store.editor.assignedHeadlineFont.family === DEFAULT_FONTS.headline &&
      store.editor.assignedHeadlineFont.weight === DEFAULT_WEIGHTS.headline
   )
})

const isDefaultBodyAssigned = computed(() => {
   if (!store.editor.assignedBodyFont) return false

   return (
      store.editor.assignedBodyFont.family === DEFAULT_FONTS.body &&
      store.editor.assignedBodyFont.weight === DEFAULT_WEIGHTS.body
   )
})

const isPreviewingAssignedHeading = computed(() => {
   if (!store.editor.assignedHeadlineFont) return false

   return (
      store.preview.headlineFont.family === store.editor.assignedHeadlineFont.family &&
      store.preview.headlineFont.weight === store.editor.assignedHeadlineFont.weight
   )
})

const isPreviewingAssignedBody = computed(() => {
   if (!store.editor.assignedBodyFont) return false

   return (
      store.preview.bodyFont.family === store.editor.assignedBodyFont.family &&
      store.preview.bodyFont.weight === store.editor.assignedBodyFont.weight
   )
})
</script>

<template>
   <div class="Preview_Header">
      <PreviewHeaderBar
         v-if="!hideAssigned"
         label="Assigned"
         :headingCombination="store.editor.assignedHeadlineFont"
         :bodyCombination="store.editor.assignedBodyFont"
         :displayHeadingChip="isDefaultHeadingAssigned"
         :displayBodyChip="isDefaultBodyAssigned"
         chipText="Default"
         accentColor="var(--success-color)"
      />

      <span class="Preview_Header_Divider" v-if="!hideAssigned" />

      <PreviewHeaderBar
         label="Previewing"
         :headingCombination="store.preview.headlineFont"
         :bodyCombination="store.preview.bodyFont"
         :displayHeadingChip="isPreviewingAssignedHeading"
         :displayBodyChip="isPreviewingAssignedBody"
         chipText="Assigned"
         accentColor="var(--accent-color)"
      />
   </div>
</template>

<style scoped>
.Preview_Header {
   display: flex;
   flex-direction: column;
   gap: var(--size-4);
}
.Preview_Header_Divider {
   height: 1px;
   background-color: var(--divider-color);
}
</style>
