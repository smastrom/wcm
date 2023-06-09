<script setup lang="ts">
import RangeSlider from './RangeSlider.vue'
import ActionButton from './ActionButton.vue'
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue'

import { FONT_SIZE_OPTIONS } from '@/lib/constants'
import { ExplorerFonts } from '@/lib/getExplorerFonts'
import { useStore } from '@/lib/store'

const props = defineProps<{
   cssWeights: ExplorerFonts['cssWeights']
   familyName: string
   previewText: string
   isMobile: boolean
}>()

const store = useStore()

/* Data */

const isMobile = toRef(props, 'isMobile')
const isActionBarActive = ref(isMobile.value)

const internalWeight = ref(props.cssWeights[0])
const internalSize = ref(store.editor.globalFontSize)

/* Watchers */

watch(
   () => store.editor.globalFontSize,
   (newValue) => {
      internalSize.value = newValue
   }
)

/* Events */

let activeTimeout: NodeJS.Timeout

function onPointerEnter() {
   clearTimeout(activeTimeout)

   activeTimeout = setTimeout(() => {
      isActionBarActive.value = true
      clearTimeout(activeTimeout)
   }, 300)
}

function onPointerLeave() {
   isActionBarActive.value = false
   clearTimeout(activeTimeout)
}

const pointerEvents = computed(() => {
   if (isMobile.value) return {}
   return {
      onpointerenter: onPointerEnter,
      onpointerleave: onPointerLeave
   }
})

function onFontWeightChange(value: string) {
   internalWeight.value = value
}

function onFontSizeChange(value: string) {
   internalSize.value = value
}

function onClick() {
   console.log('Clicked action button')
}

const commonRangeStyles = {
   width: 'var(--size-11)',
   fontSize: 'var(--font-size-0)'
}
</script>

<template>
   <article class="Entry_Wrapper" v-bind="pointerEvents">
      <Transition name="ActionBar_Fade">
         <nav class="ActionBar_Wrapper" v-if="(isActionBarActive && !isMobile) || isMobile">
            <!-- Font Controls  -->

            <div class="ActionBar_Controls">
               <!-- Font Size -->

               <RangeSlider
                  v-bind="commonRangeStyles"
                  :steps="FONT_SIZE_OPTIONS"
                  :initialValue="internalSize"
                  @change="onFontSizeChange"
               />

               <!-- Font Weight -->

               <RangeSlider
                  v-bind="commonRangeStyles"
                  v-if="props.cssWeights.length > 1"
                  :steps="props.cssWeights"
                  :initialValue="internalWeight"
                  @change="onFontWeightChange"
               />
            </div>

            <!-- Right Actions -->

            <div class="ActionBar_Buttons_Wrapper">
               <!-- Update Preview -->

               <div class="ActionBar_Buttons">
                  <div class="ActionBar_Buttons_Title">Preview</div>

                  <ActionButton
                     :isActive="true"
                     activeColor="var(--accent-color)"
                     label="Preview headline text"
                     @click="onClick"
                  >
                     H
                  </ActionButton>

                  <ActionButton
                     :isActive="false"
                     activeColor="var(--accent-color)"
                     label="Preview body text"
                     @click="onClick"
                  >
                     P
                  </ActionButton>
               </div>

               <!-- Assign Font -->

               <div class="ActionBar_Buttons">
                  <div class="ActionBar_Buttons_Title">Assign</div>
                  <ActionButton
                     :isActive="false"
                     activeColor="var(--success-color)"
                     label="Assign to headline combination"
                     @click="onClick"
                  >
                     H
                  </ActionButton>

                  <ActionButton
                     :isActive="false"
                     label="Assign to body combination"
                     activeColor="var(--success-color)"
                     @click="onClick"
                  >
                     P
                  </ActionButton>
               </div>

               <span class="ActionBar_Buttons_Divider" />

               <!-- Download -->

               <ActionButton
                  :isActive="false"
                  label="Download font"
                  activeColor="var(--warning-color)"
                  @click="onClick"
               >
                  <ArrowLeftIcon class="ActionBar_Buttons_ArrowIcon" />
               </ActionButton>
            </div>
         </nav>
      </Transition>

      <!-- Font Preview -->

      <div class="Entry_Text">
         <h2>
            {{ familyName }}
         </h2>
         <div
            :style="{
               'font-family': props.familyName,
               'font-weight': internalWeight,
               'font-size': internalSize,
               'line-height': 1
            }"
         >
            {{ previewText || familyName }}
         </div>
      </div>
   </article>
</template>

<style scoped>
.Entry_Wrapper {
   --border: var(--border-size-1) solid var(--divider-color);

   position: relative;
   padding: var(--size-8) 0;
   display: flex;
   flex-direction: column;
   grid-gap: 1rem;
   border-bottom: var(--border);

   @media (--size-lg) {
      padding: var(--size-10) 0 var(--size-8) 0;
   }
}

.Entry_Text {
   padding: var(--size-2) 0 var(--size-2) var(--size-3);
   border-left: 3px solid var(--divider-color);
   display: flex;
   flex-direction: column;
   gap: var(--size-3);

   & h2 {
      color: var(--fg-body-light-color);
      font-weight: 700;
   }
}

.ActionBar_Fade-enter-active,
.ActionBar_Fade-leave-active {
   transition: opacity 150ms var(--easing);
}

.ActionBar_Fade-enter-from,
.ActionBar_Fade-leave-to {
   opacity: 0;
}

.ActionBar_Wrapper {
   position: absolute;
   top: 0;
   display: flex;
   justify-content: space-between;
   width: 100%;
   padding: var(--size-3) 20px var(--size-3) 0;
   overflow: auto;
   align-items: center;

   @media (--size-lg) {
      gap: var(--size-5);
   }
}

.ActionBar_Buttons_Wrapper {
   display: flex;
   gap: var(--size-3);
   align-items: center;
}

.ActionBar_Buttons_Divider {
   width: 1px;
   height: 100%;
   background-color: var(--divider-color);
}

.ActionBar_Buttons_ArrowIcon {
   transform: rotate(-90deg);
   stroke: var(--bg-color);
}

.ActionBar_Buttons_Title {
   font-size: var(--font-size-0);
}

.ActionBar_Controls {
   height: fit-content;
   display: flex;
   gap: var(--size-4);
}

.ActionBar_Buttons {
   display: flex;
   gap: var(--size-2);
   align-items: center;
}
</style>
