<script setup lang="ts">
import { useStore } from '@/lib/store'
import { fetchFonts, fetchWords } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'

const store = useStore()

onBeforeMount(async () => {
   const x = await fetchWords('it', 4)
   let fontsRes = await fetchFonts()
   if (!fontsRes) return

   const fonts = getFonts(fontsRes)
   store.fonts.actions.setFonts(fonts)

   console.log(x)
})

watchEffect(() => {
   console.log(store.editor.searchValueModel)
   console.log('store.editor.activeFonts', store.editor.activeFontsComputed)
})
</script>

<template>
   <span>IndexPage</span>
</template>
