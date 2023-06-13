<script setup lang="ts">
import { useStore } from '@/lib/store'
import { debounce, randomID } from '@/lib/utils'
import {
   SORT_CRITERIA,
   EDITOR_CATEGORIES as CATEGORIES,
   FONT_SIZE_OPTIONS,
   APP_CRITICAL_ERROR
} from '@/lib/constants'

import RangeSlider from './RangeSlider.vue'
import RadioGroup from './RadioGroup.vue'
import Select from './Select.vue'

import type { StoreEditorFontSizes } from '@/types/store'
import type { GoogleAPISortCriteria } from '@/types/fetch'

const store = useStore()

const categoriesWithCount = computed(() =>
   CATEGORIES.map(({ label, value }) => ({
      label: `${label} (${store.fonts.data.value?.[value]?.length ?? 0})`,
      value
   }))
)

/* Events */

async function onAsyncSelectChange(value: GoogleAPISortCriteria) {
   try {
      await store.fonts.actions.fetchAndSetFonts(value)
      store.editor.actions.setSortCriteria(value)
   } catch (error) {
      throw new Error(`[editor-toolbar-select] - ${APP_CRITICAL_ERROR}`)
   }
}

function onRangeChange(value: string) {
   store.editor.actions.setGlobalFontSize(value as StoreEditorFontSizes)
}

function onSearchInput(event: Event) {
   store.editor.actions.setSearchValue((event.target as HTMLInputElement).value)
}

const debounceOnSearchInput = debounce(onSearchInput, 500)

/* IDs */

const fontSizeRangeId = randomID()
const sortSelectId = randomID()
const categoryLabelId = randomID()
</script>

<template>
   <nav class="Nav">
      <!-- Search -->

      <div class="Fieldset">
         <label class="Fieldset_Label" for="editor_search"
            >Search {{ store.editor.activeCategoryModel }} fonts</label
         >
         <input
            class="Global_InputField SearchField"
            type="search"
            id="editor_search"
            maxlength="25"
            :placeholder="`Search ${
               store.editor.activeCategoryModel === 'handwriting'
                  ? 'script'
                  : store.editor.activeCategoryModel
            } fonts...`"
            @input="debounceOnSearchInput"
            :disabled="store.editor.isLoadingAllFonts"
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
            :isLoading="store.editor.isLoadingAllFonts"
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

      <div class="Fieldset Fielset_GapEffect" role="radiogroup" :aria-labelledby="categoryLabelId">
         <legend :id="categoryLabelId" class="Fieldset_Label">Category</legend>
         <RadioGroup
            v-model="store.editor.activeCategoryModel"
            :options="categoriesWithCount"
            :isDisabled="store.editor.isLoadingAllFonts"
         />
      </div>
   </nav>
</template>

<style scoped>
.SearchField {
   padding: 0.4em 1em !important;
   transition: opacity 100ms var(--easing);

   &[disabled] {
      @apply --field-loading-effect;
   }
}
.Nav {
   overflow-x: auto;
   overflow-y: hidden;
   display: grid;
   grid-auto-flow: column;
   gap: var(--size-4);
   justify-items: left;
   padding-bottom: var(--size-2);
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
