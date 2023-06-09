<script setup lang="ts">
import PreviewHeader from './PreviewHeader.vue'

const route = useRoute()
</script>

<template>
   <div v-if="route.name === 'editor'" class="Preview_Header">
      <PreviewHeader />
   </div>
</template>

<style scoped>
.Preview_Header {
   display: flex;
   flex-direction: column;
   gap: var(--size-4);
}
</style>
