<script setup lang="ts">
import { db } from '@/lib/db'
import { useStore } from '@/lib/store'
import { fetchFonts } from '@/lib/fetch'
const store = useStore()

watchEffect(() => {
   console.log(store.editor.computed.selectedFontTypes)
})

onBeforeMount(async () => {
   const y = await db.getAll()
   if (!y) db.init()
   const x = await db.create({
      name: 'Test',
      previewText: 'Test Test Test',
      headline: {
         family: 'Roboto',
         weight: '700'
      },
      body: {
         family: 'Roboto',
         weight: '400'
      }
   })
   console.log(x)

   const fonts = await fetchFonts()
   console.log(fonts)
})
</script>

<template>
   <div class="div">
      <span>IndexPage</span>

      <input type="checkbox" v-model="store.editor.fontTypes.sans" />
      <input type="checkbox" v-model="store.editor.fontTypes.serif" />
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
