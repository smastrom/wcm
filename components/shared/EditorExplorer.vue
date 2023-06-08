<script setup lang="ts">
import { useStore } from '@/lib/store'
import { getExplorerFonts, type ExplorerFonts } from '@/lib/getExplorerFonts'

const store = useStore()

const previewText = ref('')

const explorerFonts = ref<ExplorerFonts[]>([])
const fontSize = computed(() => store.editor.globalFontSize)

let intersectionObserver: IntersectionObserver

const sentinelRef = ref<HTMLDivElement | null>(null)

watch(
   () => store.editor.activeFontsComputed,
   async (newValue) => {
      const first15Fonts = newValue.slice(0, 15).map((font) => ({ ...font, cssWeights: [] }))
      const fontsToRender = await getExplorerFonts(first15Fonts)

      explorerFonts.value = fontsToRender
   },
   { immediate: true }
)

onMounted(() => {
   intersectionObserver = new IntersectionObserver(
      async ([{ isIntersecting }]) => {
         if (explorerFonts.value.length > 0 && isIntersecting) {
            const next10Fonts = store.editor.activeFontsComputed
               .slice(explorerFonts.value.length, explorerFonts.value.length + 10)
               .map((font) => ({ ...font, cssWeights: [] }))

            const next10FontsToRender = await getExplorerFonts(next10Fonts)

            explorerFonts.value.splice(explorerFonts.value.length, 0, ...next10FontsToRender)
         }
      },
      { rootMargin: '-300px 0px 0px 0px', threshold: 1.0 }
   )

   if (!sentinelRef.value) return
   intersectionObserver.observe(sentinelRef.value)
})

// Render a button to refresh the page if there's an error with fonts
// Create the spinner for the sentinel and for the initial load
</script>

<template>
   <div class="Explorer_Wrapper">
      <input v-model="previewText" />
      <div>
         <!-- Preview -->

         <div v-if="explorerFonts.length > 0">
            <div v-for="font in explorerFonts">
               <div
                  :key="font.family"
                  :style="{
                     'font-family': font.family,
                     'font-weight': font.cssWeights?.[0],
                     'font-size': fontSize
                  }"
               >
                  {{ previewText || font?.family }}
               </div>
            </div>
         </div>

         <!-- Sentinel -->

         <div ref="sentinelRef">
            <div>Sentinel</div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.Explorer_Wrapper {
   overflow: auto;
}
</style>
