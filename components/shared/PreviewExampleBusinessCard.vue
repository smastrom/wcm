<script setup lang="ts">
import { useStore } from '@/lib/store'

const store = useStore()

const headlineStyles = computed(() => store.preview.computedStyles.headline)
</script>

<template>
   <div role="img" class="Preview_Card_Wrapper">
      <div class="Preview_Card_Dot" :style="headlineStyles">T</div>

      <div class="Preview_Card_Top">
         <div class="Preview_Card_Name" :style="headlineStyles">Teddy Lewis McDonald</div>
         <div :style="store.preview.computedStyles.body">
            Attorney at Law - McDonald &amp; Associates
         </div>
      </div>

      <div class="Preview_Card_Address" :style="store.preview.computedStyles.body">
         <div>
            1234 Main Street, Anytown, USA 12345 <br />
            Phone: 123-456-7890 - Email: teddy@mcdonald.com
         </div>
      </div>
   </div>
</template>

<style scoped>
.Preview_Card_Wrapper {
   @apply --preview-content-reset;

   background-color: var(--bg-color);
   aspect-ratio: 3.5 / 2;
   min-width: 450px;
   margin: auto;
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
   background-color: var(--fg-headline-color);
}

.Preview_Card_Name {
   font-size: 22px;
   line-height: 1.2;
   margin-bottom: var(--size-1);
   color: var(--fg-headline-color);
}

.Preview_Card_Address {
   font-size: var(--font-size-0);
   line-height: 1.5;
   color: var(--text-color-secondary);
}
</style>
