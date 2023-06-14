<script setup lang="ts">
import LinkIcon from '@/components/shared/icons/LinkIcon.vue'

import { useStore } from '@/lib/store'

const store = useStore()

const copy = {
   headline: 'Connect with anyone',
   body: 'FriendConnect is a cutting-edge software application designed to enhance and streamline your social interactions.'
}

const headlineStyles = computed(() => store.preview.computedStyles.headline)
const bodyStyles = computed(() => store.preview.computedStyles.body)
</script>

<template>
   <div class="Preview_Website_Wrapper" role="img">
      <div class="Preview_Website_Card_Wrapper">
         <LinkIcon width="40px" fill="#7561ff" />
         <h1 :style="headlineStyles">{{ copy.headline }}</h1>
         <p :style="bodyStyles">
            {{ copy.body }}
         </p>
      </div>

      <div class="Preview_Website_Card_Wrapper" data-preview-inverted>
         <LinkIcon width="40px" fill="#d7d1ff" />
         <h1 :style="headlineStyles">{{ copy.headline }}</h1>
         <p :style="bodyStyles">
            {{ copy.body }}
         </p>
      </div>
   </div>
</template>

<style scoped>
.Preview_Website_Wrapper {
   @apply --preview-content-reset;

   display: grid;
   gap: var(--size-4);
   overflow: hidden;
   margin: auto;
   max-width: 500px;
}

.Preview_Website_Card_Wrapper {
   display: grid;
   gap: var(--size-2);
   border-radius: var(--radius-3);
   padding: var(--size-4);
   box-shadow: var(--shadow-3);
   background-color: var(--bg-color);

   @media (--size-max) {
      gap: var(--size-1);
      font-size: var(--size-3);
   }

   & h1 {
      font-size: var(--font-size-3);
      color: #0f172a;

      @media (--size-max) {
         font-size: var(--font-size-2);
      }
   }

   & p {
      font-size: var(--font-size-2);
      color: var(--fg-body-slate-color);
      line-height: 1.65;

      @media (--size-max) {
         font-size: var(--font-size-1);
      }
   }

   &[data-preview-inverted] {
      background-color: #434a53;

      & h1 {
         color: var(--bg-color);
      }

      & p {
         color: #d3d8dd;
      }
   }
}
</style>
