<script setup lang="ts">
import PreviewHeader from './PreviewHeader.vue'
import PreviewContentSwitcher from './PreviewContentSwitcher.vue'
import PreviewContent from './PreviewContent.vue'

const route = useRoute()
</script>

<template>
   <div class="Preview_Wrapper">
      <PreviewHeader v-if="route.name === 'editor'" />

      <PreviewContentSwitcher />

      <PreviewContent />
   </div>
</template>

<style scoped>
.Preview_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-6);
}
</style>
