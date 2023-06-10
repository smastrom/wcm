<script setup lang="ts">
import domToImage from 'dom-to-image'
import { saveAs } from 'file-saver'

import { useStore } from '@/lib/store'
import { getFamily } from '@/lib/fonts'

import ImageIcon from '@/components/shared/icons/ImageIcon.vue'

const store = useStore()

async function onClick() {
   try {
      const headlineFamily = getFamily(store.fonts.data.value!, store.preview.headlineFont.family)
      const bodyFamily = getFamily(store.fonts.data.value!, store.preview.bodyFont.family)

      const headlineUrl = headlineFamily.files[store.preview.headlineFont.weight]
      const bodyUrl = bodyFamily.files[store.preview.bodyFont.weight]

      const style = document.createElement('style')

      style.innerHTML = `
         @font-face {
            font-family: ${headlineFamily.family}; font-style: normal;
            font-weight: ${store.preview.headlineFont.weight};
            src: url('${headlineUrl}') format('woff2');
         }

         @font-face {
            font-family: ${bodyFamily.family}; font-style: normal;
            font-weight: ${store.preview.bodyFont.weight};
            src: url('${bodyUrl}') format('woff2');
         }
   `

      const target = document.getElementById('canvas_font_injector') // in index.html
      if (!target) return

      const source = document.getElementById('preview_container')
      if (!source) return

      target.appendChild(style)

      const imageBlob = await domToImage.toBlob(source)
      if (!imageBlob) return

      saveAs(
         imageBlob,
         `${store.preview.exampleModel}-preview-${store.preview.headlineFont.family}+${store.preview.bodyFont.family}.png`
      )

      target.removeChild(style)
   } catch (error) {
      console.log(error)
   }
}
</script>

<template>
   <button @click="onClick" class="Global_ActionButton Preview_Download_Button">
      <ImageIcon width="20px" />
      Download
   </button>
</template>

<style scoped>
.Preview_Download_Button {
   display: flex;
   gap: var(--size-2);
   align-items: center;
}
</style>
