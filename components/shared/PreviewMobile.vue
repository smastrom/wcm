<script setup lang="ts">
import PreviewHeader from './PreviewHeader.vue'
import PreviewContentSwitcher from './PreviewContentSwitcher.vue'
import PreviewContent from './PreviewContent.vue'

import { useViewport } from '@/lib/useViewport'

const { isMatch: isMobile } = useViewport('1100px')

const isMenuToggled = ref(false)
const isMobilePreviewToggled = ref(false)

function toggleMenu() {
   isMenuToggled.value = !isMenuToggled.value
}

function toggleMobilePreview() {
   isMobilePreviewToggled.value = !isMobilePreviewToggled.value
}
</script>

<template>
   <div v-if="isMobile">
      <!--- Header Button -->

      <button
         class="Global_ActionButton Preview_Mobile_Button"
         :style="{
            'background-color': isMenuToggled ? 'var(--error-color)' : 'var(--accent-color)'
         }"
         @click="toggleMenu"
      >
         {{ isMenuToggled ? 'Close' : 'Open' }} Menu
      </button>

      <!-- Mobile Menu Teleport -->

      <Teleport to="body">
         <Transition name="Preview_Mobile_Wobble">
            <div class="Preview_Wrapper" v-if="isMenuToggled">
               <PreviewHeader />

               <button
                  class="Global_ActionButton Preview_Mobile_Button"
                  v-if="isMobile"
                  @click="toggleMobilePreview"
               >
                  Open Preview
               </button>
            </div>
         </Transition>
      </Teleport>

      <!-- Preview Teleport -->

      <Teleport to="body">
         <Transition name="Preview_Mobile_Wobble">
            <div class="Preview_Mobile_Wrapper" v-if="isMobilePreviewToggled">
               <div class="Preview_Mobile_Header">
                  <h2 class="Preview_Mobile_Title">Combination Preview</h2>
                  <button class="Preview_Mobile_Close" @click="toggleMobilePreview">Close</button>
               </div>
               <PreviewHeader :hideAssigned="true" />
               <PreviewContentSwitcher />
               <PreviewContent />
            </div>
         </Transition>
      </Teleport>
   </div>
</template>

<style scoped>
.Preview_Wrapper {
   overflow: auto;
   display: flex;
   flex-direction: column;
   gap: var(--size-6);
   position: fixed;
   top: var(--size-10);
   right: var(--size-4);
   background-color: var(--bg-color);
   padding: var(--size-3);
   box-shadow: var(--shadow-3);
   border-radius: var(--size-3);
   z-index: 10;

   @media (--layout-switch) {
      justify-content: space-between;
   }
}

.Preview_Mobile_Title {
   font-size: var(--font-size-3);
   font-weight: 700;
   color: var(--fg-headline-color);
   line-height: var(--font-lineheight-1);
}

.Preview_Mobile_Wrapper {
   position: fixed;
   bottom: 0;
   left: 0;
   top: 0;
   right: 0;
   width: 100vw;
   padding: var(--size-4);
   background-color: var(--bg-color);
   display: flex;
   flex-direction: column;
   gap: var(--size-6);
   z-index: 10;
   overflow: auto;

   @media (min-width: 1101px) {
      display: none;
   }
}

.Preview_Mobile_Button {
   font-size: var(--font-size-0);
}

.Preview_Mobile_Header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: var(--size-6);
}

.Preview_Mobile_Wobble-enter-active,
.Preview_Mobile_Wobble-leave-active {
   transition: all 200ms var(--easing);
}

.Preview_Mobile_Wobble-enter-from,
.Preview_Mobile_Wobble-leave-to {
   transform: scale(0.9) translateY(-100px);
   opacity: 0;
}

.Preview_Mobile_Close {
   font-size: var(--font-size-1);
   font-weight: 700;
   color: var(--error-color);
   cursor: pointer;
}
</style>
