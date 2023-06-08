<script setup lang="ts">
import { useStore } from '@/lib/store'
import { useUpdateQuery } from '@/lib/useUpdateQuery'
import { validateQueryParam as isValid } from '@/lib/utils'
import { fetchFonts } from '@/lib/fetch'
import {
   SORT_CRITERIA,
   EDITOR_CATEGORIES as CATEGORIES,
   EDITOR_VARIANTS as VARIANTS,
   EDITOR_QUERY_KEYS as QUERY_KEYS,
   FONT_SIZE_OPTIONS
} from '@/lib/constants'

import RangeSlider from './RangeSlider.vue'
import RadioGroup from './RadioGroup.vue'
import Select from './Select.vue'

import type { StoreEditorFontSizes, AppFontCategories, AppFontVariants } from '@/types/store'
import type { GoogleAPISortCriteria } from '@/types/fetch'

// At this point the store is already populated with fonts

const store = useStore()
const route = useRoute()
const updateQuery = useUpdateQuery()

/* Query */

// Mount

if (
   isValid(
      route.query[QUERY_KEYS.sort],
      SORT_CRITERIA.map(({ value }) => value)
   )
) {
   store.editor.actions.setSortCriteria(route.query[QUERY_KEYS.sort] as GoogleAPISortCriteria)
} else {
   updateQuery(QUERY_KEYS.sort, SORT_CRITERIA[0].value)
}

if (
   isValid(
      route.query[QUERY_KEYS.category],
      CATEGORIES.map(({ value }) => value)
   )
) {
   store.editor.actions.setActiveCategory(route.query[QUERY_KEYS.category] as AppFontCategories)
} else {
   updateQuery(QUERY_KEYS.sort, CATEGORIES[0].value)
}

if (
   isValid(
      route.query[QUERY_KEYS.variant],
      VARIANTS.map(({ value }) => value)
   )
) {
   store.editor.actions.setActiveVariant(route.query[QUERY_KEYS.variant] as AppFontVariants)
} else {
   updateQuery(QUERY_KEYS.variant, VARIANTS[0].value)
}

if (isValid(route.query[QUERY_KEYS.fontsize], FONT_SIZE_OPTIONS as string[])) {
   store.editor.actions.setGlobalFontSize(route.query[QUERY_KEYS.fontsize] as StoreEditorFontSizes)
} else {
   updateQuery(QUERY_KEYS.fontsize, FONT_SIZE_OPTIONS[5])
}

// Update

watch(
   () => store.editor.activeCategoryModel,
   (newValue) => updateQuery(QUERY_KEYS.category, newValue)
)

watch(
   () => store.editor.activeVariantModel,
   (newValue) => updateQuery(QUERY_KEYS.variant, newValue)
)

watch(
   () => store.editor.sortCriteriaModel,
   (newValue) => updateQuery(QUERY_KEYS.sort, newValue)
)

watch(
   () => store.editor.globalFontSize,
   (newValue) => updateQuery(QUERY_KEYS.fontsize, newValue)
)

/* Font Size */

const isSelectLoading = ref(false)

async function onAsyncChange(value: GoogleAPISortCriteria) {
   isSelectLoading.value = true
   await new Promise((resolve) => setTimeout(resolve, 2000)).catch(() => {}) // TODO: handle error once browse is done
   await fetchFonts(value)
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
               placeholder="Search fonts..."
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
               @asyncChange="onAsyncChange"
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
