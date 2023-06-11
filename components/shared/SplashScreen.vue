<script setup lang="ts">
import LogoIcon from './icons/LogoIcon.vue'

const title = defineProp('Welcome to WCM!')
const subtitle = defineProp('Enjoy creating webfonts combinations.')
</script>

<template>
   <div class="Wrapper">
      <div class="Header">
         <LogoIcon width="80px" />
         <h1>Webfont Combination Manager</h1>
      </div>

      <div class="Copy">
         <h2>{{ title }}</h2>
         <p>{{ subtitle }}</p>
      </div>
      <slot />
   </div>
</template>

<style scoped>
.Wrapper {
   --padding: var(--size-4);

   background-color: var(--bg-color);
   padding: var(--padding);
   min-height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   flex-direction: column;
   gap: var(--size-8);
}

.Header {
   position: absolute;
   top: var(--padding);
   display: grid;
   gap: var(--size-2);
   justify-items: center;
   text-align: center;
   line-height: var(--font-lineheight-1);

   & h1 {
      color: var(--fg-body-color);
      font-size: var(--font-size-1);
   }
}

.Copy {
   max-width: var(--size-content-3);
   text-align: center;
   display: grid;
   gap: var(--size-2);

   & h2 {
      font-size: var(--font-size-7);
      font-weight: 700;
      color: var(--fg-headline-color);
      line-height: var(--font-lineheight-1);

      @media (--size-md) {
         font-size: var(--font-size-6);
      }

      @media (--size-sm) {
         font-size: var(--font-size-5);
      }
   }

   & p {
      font-size: var(--font-size-4);
      color: var(--fg-body-color);

      @media (--size-md) {
         font-size: var(--font-size-3);
      }
   }
}
</style>
