<script setup lang="ts">
import { useStore } from '@/lib/store'

import PreviewHeaderBar from './PreviewHeaderBar.vue'

import {
   DEFAULT_BODY_FONT,
   DEFAULT_FONTS,
   DEFAULT_HEADLINE_FONT,
   DEFAULT_WEIGHTS
} from '@/lib/constants'

const hideAssigned = defineProp(false, false)

const store = useStore()

const isDefaultHeadingAssigned = computed(() => {
   if (!store.editor.assignedHeadlineFont) return false

   const { family, weight } = store.editor.assignedHeadlineFont
   return family === DEFAULT_FONTS.headline && weight === DEFAULT_WEIGHTS.headline
})

const isDefaultBodyAssigned = computed(() => {
   if (!store.editor.assignedBodyFont) return false

   const { family, weight } = store.editor.assignedBodyFont
   return family === DEFAULT_FONTS.body && weight === DEFAULT_WEIGHTS.body
})

const isPreviewingAssignedHeading = computed(() => {
   if (!store.editor.assignedHeadlineFont) return false

   const { family, weight } = store.editor.assignedHeadlineFont
   const { family: previewFamily, weight: previewWeight } = store.preview.headlineFont

   return family === previewFamily && weight === previewWeight
})

const isPreviewingAssignedBody = computed(() => {
   if (!store.editor.assignedBodyFont) return false

   const { family, weight } = store.editor.assignedBodyFont
   const { family: previewFamily, weight: previewWeight } = store.preview.bodyFont

   return family === previewFamily && weight === previewWeight
})
</script>

<template>
   <nav class="Preview_Header">
      <PreviewHeaderBar
         v-if="!hideAssigned"
         label="Assigned"
         :headingCombination="store.editor.assignedHeadlineFont ?? DEFAULT_HEADLINE_FONT"
         :bodyCombination="store.editor.assignedBodyFont ?? DEFAULT_BODY_FONT"
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
   </nav>
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
