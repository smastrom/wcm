<script setup lang="ts">
import { useStore } from '@/lib/store'
import { fetchFonts } from '@/lib/fetch'
import { getFonts } from '@/lib/fonts'
import {
   SORT_CRITERIA,
   EDITOR_CATEGORIES as CATEGORIES,
   EDITOR_VARIANTS as VARIANTS,
   FONT_SIZE_OPTIONS
} from '@/lib/constants'

import RangeSlider from './RangeSlider.vue'
import RadioGroup from './RadioGroup.vue'
import Select from './Select.vue'

import type { StoreEditorFontSizes } from '@/types/store'
import type { GoogleAPISortCriteria } from '@/types/fetch'

const store = useStore()

const isSelectLoading = ref(false)

async function onAsyncSelectChange(value: GoogleAPISortCriteria) {
   isSelectLoading.value = true
   const fonts = await fetchFonts(value)
   if (!fonts) return store.editor.actions.setSortCriteria(SORT_CRITERIA[0].value)

   const sortedFonts = getFonts(fonts)
   store.fonts.actions.setFonts(sortedFonts)
   triggerRef(store.fonts.data)

   isSelectLoading.value = false
   store.editor.actions.setSortCriteria(value)
}

function onRangeChange(value: string) {
   store.editor.actions.setGlobalFontSize(value as StoreEditorFontSizes)
}

/* IDs */

const fontSizeRangeId = crypto.randomUUID()
const sortSelectId = crypto.randomUUID()
const categoryLabelId = crypto.randomUUID()
const variantLabelId = crypto.randomUUID()
</script>

<template>
   <div class="Scroller">
      <nav class="Nav">
         <!-- Search -->

         <div class="Fieldset">
            <label class="Fieldset_Label" for="editor_search">Search fonts</label>
            <input
               class="Global_InputField SearchField"
               type="text"
               id="editor_search"
               maxlength="25"
               :placeholder="`Search ${store.editor.activeCategoryModel} fonts...`"
               v-model="store.editor.searchValueModel"
            />
         </div>

         <!-- Sort -->

         <div class="Fieldset">
            <label class="Fieldset_Label" :for="sortSelectId">Sort by</label>
            <Select
               :isAsync="true"
               :id="sortSelectId"
               :options="SORT_CRITERIA"
               v-model="store.editor.sortCriteriaModel"
               @asyncChange="onAsyncSelectChange"
               :isLoading="isSelectLoading"
            />
         </div>

         <!-- Font Size -->

         <div class="Fieldset Fielset_GapEffect">
            <label class="Fieldset_Label" :for="fontSizeRangeId">Global Size</label>
            <RangeSlider
               :id="fontSizeRangeId"
               :steps="FONT_SIZE_OPTIONS"
               :initialValue="store.editor.globalFontSize"
               @change="onRangeChange"
            />
         </div>

         <!-- Category (<fieldset> can't be flex, using div) -->

         <div
            class="Fieldset Fielset_GapEffect"
            role="radiogroup"
            :aria-labelledby="categoryLabelId"
         >
            <legend :id="categoryLabelId" class="Fieldset_Label">Category</legend>
            <RadioGroup v-model="store.editor.activeCategoryModel" :options="CATEGORIES" />
         </div>

         <!-- Variants -->

         <div
            class="Fieldset Fielset_GapEffect"
            role="radiogroup"
            :aria-labelledby="variantLabelId"
         >
            <legend :id="variantLabelId" class="Fieldset_Label">Variants</legend>
            <RadioGroup v-model="store.editor.activeVariantModel" :options="VARIANTS" />
         </div>
      </nav>
   </div>
</template>

<style scoped>
.SearchField {
   padding: 0.4em 1em !important;
}
.Nav {
   overflow-x: auto;
   display: grid;
   grid-auto-flow: column;
   gap: var(--size-4);
   justify-items: left;
   padding-bottom: var(--size-5);
   font-size: var(--font-size-1);
}

.Fieldset {
   display: grid;
   gap: var(--size-2);
   height: 100%;
   align-content: start;
   font-size: 90%;
}

.Fielset_GapEffect {
   gap: var(--size-3);
}

.Fieldset_Label {
   white-space: nowrap;
   font-size: var(--font-size-0);
   font-weight: 700;
   color: var(--fg-headline-color);
}
</style>
