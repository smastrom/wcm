<script setup lang="ts">
import { useStore } from '@/lib/store'

const store = useStore()

const bodyStyles = computed(() => store.preview.computedStyles.body)
</script>

<template>
   <div class="Preview_Letterhead_Wrapper" role="img">
      <div class="Preview_Letterhead_Header">
         <h1 :style="store.preview.computedStyles.headline">Teddy Lewis McDonald</h1>
         <div :style="bodyStyles">Attorney at Law - McDonald &amp; Associates</div>
      </div>

      <div class="Preview_Letterhead_Body" :style="bodyStyles">
         Teddy McDonald is a prominent figure in the field of law, renowned for his exceptional
         skills, unwavering dedication, and extensive knowledge. With an impressive career spanning
         over three decades, McDonald has established himself as a highly respected and accomplished
         lawyer, earning the admiration of clients, peers, and adversaries alike.

         <br /><br />

         As a legal professional, Teddy McDonald has displayed remarkable versatility, excelling in
         various areas of the law. Whether it's criminal defense, civil litigation, corporate law,
         or intellectual property rights, McDonald's expertise is unparalleled.
      </div>
   </div>
</template>

<style scoped>
.Preview_Letterhead_Wrapper {
   @apply --preview-content-reset;

   box-shadow: var(--shadow-3);
   background-color: var(--bg-color);
   padding: var(--size-4) var(--size-8);
   overflow: hidden;
   width: 450px;
   max-height: 600px;
   border-top: var(--size-2) solid var(--fg-headline-color);
}

.Preview_Letterhead_Header {
   color: var(--fg-headline-color);
   margin-bottom: var(--size-9);

   & h1 {
      margin-bottom: var(--size-1);
      font-size: var(--font-size-3);
   }

   & div {
      font-size: var(--font-size-0);
   }
}

.Preview_Letterhead_Body {
   width: 200%;
   line-height: 2;
   font-size: var(--font-size-1);
}
</style>
