<script setup lang="ts">
import { useStore } from '@/lib/store'

import BusinessCard from '@/components/shared/PreviewExampleBusinessCard.vue'
import BlogPost from '@/components/shared/PreviewExampleBlogPost.vue'
import Letterhead from '@/components/shared/PreviewExampleLetterhead.vue'
import Website from '@/components/shared/PreviewExampleWebsite.vue'

import type { Component as VueComponent } from 'vue'
import type { StorePreviewTypes } from '@/types/store'

const store = useStore()

const components: Record<StorePreviewTypes, VueComponent> = {
   'business-card': BusinessCard,
   'blog-post': BlogPost,
   letterhead: Letterhead,
   website: Website
}
</script>

<template>
   <div class="Preview_Content_Wrapper">
      <Component :is="components[store.preview.exampleModel]" />
   </div>
</template>

<style scoped>
.Preview_Content_Wrapper {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: var(--bg-elv-color);
   border-radius: var(--radius-3);
}
</style>
