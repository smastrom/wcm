<script setup lang="ts">
import EditorHeader from '@/components/shared/EditorHeader.vue'
import EditorToolbar from '@/components/shared/EditorHeader.vue'

const route = useRoute()

// Route guard in index.ts
</script>

<template>
   <RouterLink :to="{ name: 'combinations' }">Back</RouterLink>
   <div>{{ route.params.id }}</div>
   <div>
      <EditorHeader />
      <EditorToolbar />
   </div>
</template>
