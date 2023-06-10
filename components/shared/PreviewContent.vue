<script setup lang="ts">
import { useStore } from '@/lib/store'

import BusinessCard from '@/components/shared/PreviewExampleBusinessCard.vue'
import Letterhead from '@/components/shared/PreviewExampleLetterhead.vue'
import Website from '@/components/shared/PreviewExampleWebsite.vue'
import PreviewExampleDownloadButton from './PreviewExampleDownloadButton.vue'

import type { Component as VueComponent } from 'vue'
import type { StorePreviewTypes } from '@/types/store'

const store = useStore()

const components: Record<StorePreviewTypes, VueComponent> = {
   'business-card': BusinessCard,
   letterhead: Letterhead,
   website: Website
}
</script>

<template>
   <div class="Preview_Content_Wrapper">
      <div id="preview_container">
         <Component :is="components[store.preview.exampleModel]" />
      </div>

      <PreviewExampleDownloadButton />
   </div>
</template>

<style scoped>
.Preview_Content_Wrapper {
   height: 100%;
   display: flex;
   justify-content: center;

   align-items: center;
   padding: var(--size-4);

   background-color: var(--bg-elv-color);
   border-radius: var(--radius-3);
   position: relative;
   overflow: auto;
   min-height: 500px;

   & button {
      position: absolute;
      bottom: var(--size-4);
   }

   @media (--size-md) {
      min-height: unset;
   }
}

#preview_container {
   @media (--size-md) {
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
   }
}
</style>
