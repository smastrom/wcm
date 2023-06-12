<script setup lang="ts">
import domToImage from 'dom-to-image'
import { saveAs } from 'file-saver'

import { useStore } from '@/lib/store'
import { getFamily } from '@/lib/fontUtils'

import ImageIcon from '@/components/shared/icons/ImageIcon.vue'

const store = useStore()

// DOM to image wants the font injected via CSS (and not via FontFace) in order to render it

async function onClick() {
   try {
      if (!store.fonts.data.value) return

      const { family: prevHeadlineFamily, weight: prevHeadlineWeight } = store.preview.headlineFont
      const { family: prevBodyFamily, weight: prevBodyWeight } = store.preview.bodyFont

      const { files: headlineFiles } = getFamily(store.fonts.data.value, prevHeadlineFamily)
      const { files: bodyFiles } = getFamily(store.fonts.data.value, prevBodyFamily)

      const headlineUrl = headlineFiles[prevHeadlineWeight]
      const bodyUrl = bodyFiles[prevBodyWeight]

      const style = document.createElement('style')

      style.innerHTML = `
         @font-face {
            font-family: ${prevHeadlineFamily}; font-style: normal;
            font-weight: ${prevHeadlineWeight};
            src: url('${headlineUrl}') format('woff2');
         }

         @font-face {
            font-family: ${prevBodyFamily}; font-style: normal;
            font-weight: ${prevBodyWeight};
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
         `${store.preview.exampleModel}-preview-${prevHeadlineFamily}+${prevBodyFamily}.png`
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
