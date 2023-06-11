<script setup lang="ts">
import { useStore } from '@/lib/store'
import { StoreEditingStatus } from '@/lib/constants'

const store = useStore()

const fillColor = computed(() => {
   switch (store.editor.editingStatus) {
      case StoreEditingStatus.SAVING:
         return 'var(--warning-color)'
      case StoreEditingStatus.ERROR:
         return 'var(--error-color)'
      default:
         return 'var(--success-color)'
   }
})

const ariaLiveMessage = computed(() => {
   switch (store.editor.editingStatus) {
      case StoreEditingStatus.SAVING:
         return 'Saving combination...'
      case StoreEditingStatus.ERROR:
         return 'There was an error saving your combination'
      default:
         return 'Combination saved'
   }
})
</script>

<template>
   <div class="Dot" />
   <div class="Global_VisuallyHidden" role="status" aria-atomic="true" aria-live="polite">
      {{ ariaLiveMessage }}
   </div>
</template>

<style scoped>
.Dot {
   width: var(--size-2);
   height: var(--size-2);
   border-radius: var(--radius-round);
   background: v-bind(fillColor);
}
</style>
