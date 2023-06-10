<script setup lang="ts">
import { useStore } from '@/lib/store'

const store = useStore()

const headlineFont = computed(() => ({
   style: {
      'font-family': store.preview.headlineFont.family,
      'font-weight': store.preview.headlineFont.weight
   }
}))

const bodyFont = computed(() => ({
   style: {
      'font-family': store.preview.bodyFont.family,
      'font-weight': store.preview.bodyFont.weight
   }
}))
</script>

<template>
   <div role="img" class="Preview_Card_Wrapper">
      <div class="Preview_Card_Dot" v-bind="headlineFont">T</div>

      <div class="Preview_Card_Top">
         <div class="Preview_Card_Name" v-bind="headlineFont">Teddy Lewis McDonald</div>
         <div v-bind="bodyFont">Attorney at Law - McDonald &amp; Associates</div>
      </div>

      <div class="Preview_Card_Address" v-bind="bodyFont">
         <div>
            1234 Main Street, Anytown, USA 12345 <br />
            Phone: 123-456-7890 - Email: teddy@mcdonald.com
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato');

.Preview_Card_Wrapper {
   @apply --preview-content-reset;

   background-color: var(--bg-color);
   aspect-ratio: 3.5 / 2;
   width: 450px;
   min-width: 450px;

   white-space: pre-wrap;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;
   box-shadow: var(--shadow-3);
}

.Preview_Card_Top {
   margin-bottom: var(--size-6);
}

.Preview_Card_Dot {
   color: var(--bg-color);
   width: var(--size-8);
   height: var(--size-8);
   border-radius: var(--radius-round);
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 18px;
   font-weight: 700;
   margin-bottom: var(--size-3);
   background-color: var(--accent-color);
}

.Preview_Card_Name {
   font-size: 22px;
   line-height: 1.2;
   color: var(--text-color-primary);
   margin-bottom: var(--size-1);
}

.Preview_Card_Address {
   font-size: var(--font-size-0);
   line-height: 1.5;
   color: var(--text-color-secondary);
}
</style>
