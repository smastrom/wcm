<script setup lang="ts">
import { useStore } from '@/lib/store'
import { getExplorerFonts, type ExplorerFonts } from '@/lib/getExplorerFonts'
import { reloadPage } from '@/lib/utils'
import { useViewport } from '@/lib/useViewport'

import HorizontalSpinnerIcon from './icons/HorizontalSpinnerIcon.vue'
import SpinnerIcon from './SpinnerIcon.vue'
import EditorExplorerEntry from './EditorExplorerEntry.vue'

const store = useStore()
const { isMatch: isMobile } = useViewport('1100px')

const explorerFonts = ref<ExplorerFonts[]>([])
const previewText = ref('')

/* UI */

const isFetchingInitialFonts = ref(true)
const isFetchingFonts = ref(false)
const isFetchError = ref(false)

/* Intersection Observer */

let intersectionObserver: IntersectionObserver

const rootRef = ref<HTMLDivElement | null>(null)
const sentinelRef = ref<HTMLDivElement | null>(null)

/* Initial / Refresh Fetch */

watch(
   () => store.editor.activeFontsComputed,
   async (newValue) => {
      try {
         isFetchingInitialFonts.value = true

         const first15Fonts = newValue.slice(0, 15).map((font) => ({ ...font, cssWeights: [] }))
         const fontsToRender = await getExplorerFonts(first15Fonts)

         explorerFonts.value = fontsToRender

         isFetchingInitialFonts.value = false
      } catch (error) {
         isFetchError.value = true
      } finally {
         rootRef.value?.scrollTo({ top: 0 })
      }
   },
   { immediate: true }
)

/* Intersection Observer Fetch */

onMounted(() => {
   intersectionObserver = new IntersectionObserver(
      async ([{ isIntersecting }]) => {
         if (explorerFonts.value.length > 0 && isIntersecting) {
            try {
               isFetchingFonts.value = true

               const next10Fonts = store.editor.activeFontsComputed
                  .slice(explorerFonts.value.length, explorerFonts.value.length + 10)
                  .map((font) => ({ ...font, cssWeights: [] }))

               const next10FontsToRender = await getExplorerFonts(next10Fonts)

               isFetchingFonts.value = false

               explorerFonts.value.splice(explorerFonts.value.length, 0, ...next10FontsToRender)
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

         <div v-if="explorerFonts.length > 0">
            <div v-for="font in explorerFonts">
               <EditorExplorerEntry
                  :isMobile="isMobile"
                  :key="font.family"
                  :cssWeights="font.cssWeights"
                  :familyName="font.family"
                  :previewText="previewText"
               />
            </div>
         </div>

         <div ref="sentinelRef" />

         <div v-if="isFetchingInitialFonts && !isFetchError" class="InitialSpinner_Wrapper">
            <SpinnerIcon width="100px" />
         </div>

         <HorizontalSpinnerIcon
            v-if="isFetchingFonts && !isFetchError"
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
