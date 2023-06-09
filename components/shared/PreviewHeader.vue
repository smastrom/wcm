<script setup lang="ts">
import { useStore } from '@/lib/store'

import PreviewHeaderBar from './PreviewHeaderBar.vue'

const store = useStore()
</script>

<template>
   <PreviewHeaderBar
      label="Previewing"
      :headingCombination="store.preview.headlineFont"
      :bodyCombination="store.preview.bodyFont"
      accentColor="var(--accent-color)"
   />

   <span class="Preview_Header_Divider" />

   <PreviewHeaderBar
      label="Assigned"
      :headingCombination="store.editor.assignedHeadlineFont"
      :bodyCombination="store.editor.assignedBodyFont"
      accentColor="var(--success-color)"
   />
</template>

<style scoped>
.Preview_Header_Divider {
   height: 1px;
   background-color: var(--divider-color);
}
</style>
