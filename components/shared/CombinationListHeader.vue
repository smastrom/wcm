<script setup lang="ts">
import LogoIcon from './icons/LogoIcon.vue'
</script>

<template>
   <header class="Wrapper">
      <div class="Logo_Wrapper">
         <LogoIcon width="50px" />
         <h1>Webfont Combination Manager</h1>
      </div>
   </header>
</template>

<style scoped>
.Wrapper {
   margin: 0 auto;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: var(--size-3) var(--size-4);
   background-color: var(--bg-color);
   border-bottom: var(--border-size-2) solid var(--border-color);
   flex-wrap: wrap;
   gap: var(--size-3);
}

.Logo_Wrapper {
   display: grid;
   gap: var(--size-2);
   font-size: var(--font-size-0);
   line-height: 1;
   text-align: center;
   justify-items: center;
}
</style>
