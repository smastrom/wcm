<script setup lang="ts">
import { useStore } from '@/lib/store'
import { injectFonts } from '@/lib/injectFonts'
import { reloadPage } from '@/lib/utils'
import { useViewport } from '@/lib/useViewport'

import HorizontalSpinnerIcon from './icons/HorizontalSpinnerIcon.vue'
import SpinnerIcon from './SpinnerIcon.vue'
import EditorExplorerEntry from './EditorExplorerEntry.vue'

import type { AppFont } from '@/types/store'

const store = useStore()
const { isMatch: isMobile } = useViewport('1100px')

const explorerFonts = ref<AppFont[]>(store.editor.activeFontsComputed.slice(0, 15))
const previewText = ref('')

/* UI */

const isFetchingAdditionalFonts = ref(false)
const isFetchError = ref(false)

/* Intersection Observer */

let intersectionObserver: IntersectionObserver

const rootRef = ref<HTMLDivElement | null>(null)
const sentinelRef = ref<HTMLDivElement | null>(null)

/* Refresh Fetch */

watch(
   () => store.editor.activeFontsComputed,
   async (newValue) => {
      try {
         store.editor.actions.setIsLoadingAllFonts(true)

         const first15Fonts = newValue.slice(0, 15)
         await injectFonts(first15Fonts)

         explorerFonts.value = first15Fonts

         store.editor.actions.setIsLoadingAllFonts(false)
      } catch (error) {
         isFetchError.value = true
      } finally {
         rootRef.value?.scrollTo({ top: 0 })
      }
   }
)

/* Intersection Observer Fetch */

onMounted(() => {
   intersectionObserver = new IntersectionObserver(
      async ([{ isIntersecting }]) => {
         if (explorerFonts.value.length > 0 && isIntersecting) {
            try {
               isFetchingAdditionalFonts.value = true

               const next10Fonts = store.editor.activeFontsComputed.slice(
                  explorerFonts.value.length,
                  explorerFonts.value.length + 10
               )

               await injectFonts(next10Fonts)

               isFetchingAdditionalFonts.value = false

               explorerFonts.value.splice(explorerFonts.value.length, 0, ...next10Fonts)
            } catch (error) {
               isFetchError.value = true
            }
         }
      },
      { root: rootRef.value, rootMargin: '-200px 0px 600px 0px', threshold: [0.75, 1] }
   )

   if (!sentinelRef.value) return
   intersectionObserver.observe(sentinelRef.value)
})
</script>

<template>
   <div class="Explorer_Wrapper" ref="rootRef">
      <div>
         <!-- Preview -->

         <div v-if="explorerFonts.length > 0" class="Explorer_List">
            <EditorExplorerEntry
               v-for="font in explorerFonts"
               :isMobile="isMobile"
               :key="font.family"
               :appWeights="font.appWeights"
               :familyName="font.family"
               :previewText="previewText"
            />
         </div>

         <div ref="sentinelRef" />

         <div
            v-if="store.editor.isLoadingAllFonts && !isFetchError && !isFetchingAdditionalFonts"
            class="InitialSpinner_Wrapper"
         >
            <SpinnerIcon width="100px" />
         </div>

         <HorizontalSpinnerIcon
            v-if="isFetchingAdditionalFonts && !isFetchError"
            width="80px"
            class="HorizontalSpinner_Wrapper"
         />

         <div v-if="isFetchError" class="FetchError_Wrapper">
            <h2>There was an error with Google servers.</h2>
            <button @click="reloadPage" class="Global_ActionButton">Reload Page</button>
         </div>
      </div>
   </div>
</template>

<style scoped>
.Explorer_Wrapper {
   overflow: auto;
}

.InitialSpinner_Wrapper {
   display: flex;
   justify-content: center;
   align-items: center;

   &:deep(svg) {
      margin-top: 30vh;
   }
}

.HorizontalSpinner_Wrapper {
   margin-bottom: var(--size-6);
}

.FetchError_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-3);
   padding-bottom: var(--size-6);

   & h2 {
      font-size: var(--font-size-3);
      font-weight: 700;
   }

   & button {
      width: max-content;
   }
}
</style>
