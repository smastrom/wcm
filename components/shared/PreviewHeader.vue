<script setup lang="ts">
import { useStore } from '@/lib/store'

import PreviewHeaderBar from './PreviewHeaderBar.vue'

const store = useStore()
</script>

<template>
   <div class="Preview_Header">
      <PreviewHeaderBar
         label="Assigned"
         :headingCombination="store.editor.assignedHeadlineFont"
         :bodyCombination="store.editor.assignedBodyFont"
         accentColor="var(--success-color)"
      />

      <span class="Preview_Header_Divider" />

      <PreviewHeaderBar
         label="Previewing"
         :headingCombination="store.preview.headlineFont"
         :bodyCombination="store.preview.bodyFont"
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
