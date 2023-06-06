<script setup lang="ts">
import { useStore } from '@/lib/store'
import { fetchFonts } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'

const store = useStore()

onBeforeMount(async () => {
   let fontsRes = await fetchFonts()
   if (!fontsRes) return

   const fonts = getFonts(fontsRes)
   store.fonts.actions.setFonts(fonts)
})

watchEffect(() => {
   console.log(store.editor.searchValueModel)
   console.log('store.editor.activeFonts', store.editor.activeFontsComputed)
})
</script>

<template>
   <div class="div">
      <span>IndexPage</span>
      <input type="text" v-model="store.editor.searchValueModel" />
      <input
         type="radio"
         name="test"
         v-model="store.editor.activeCategoryModel"
         value="sans"
      />
      <input
         type="radio"
         name="test"
         v-model="store.editor.activeCategoryModel"
         value="serif"
      />
      <input
         type="radio"
         name="test"
         v-model="store.editor.activeCategoryModel"
         value="display"
      />
   </div>
</template>

<style>
.div {
   padding: var(--size-2);

   & span {
      background: red;
   }
}
</style>
\
