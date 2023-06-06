<script setup lang="ts">
import { db } from '@/lib/db'
import { fetchFonts } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'

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

   let fonts = await fetchFonts()

   if (!fonts) return

   console.log('fonts', fonts)

   const { sans, serif, display, handwriting } = getFonts(fonts)

   console.log('sans', sans)
   console.log('serif', serif)
   console.log('display', display)
   console.log('handwriting', handwriting)
})
</script>

<template>
   <div class="div">
      <span>IndexPage</span>
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
