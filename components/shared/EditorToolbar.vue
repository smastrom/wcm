<script setup lang="ts">
import { useStore } from '@/lib/store'
import {
   SORT_CRITERIA,
   EDITOR_CATEGORIES,
   EDITOR_VARIANTS,
   FONT_SIZE_OPTIONS
} from '@/lib/constants'

import RangeSlider from './RangeSlider.vue'
import RadioGroup from './RadioGroup.vue'
import Select from './Select.vue'

import type { StoreEditorFontSizes } from '@/types/store'

// 1. Check if the value from the query is valid
// 2. If it is, set the value to the model in the store
// 3. If it isn't, set the value to the default value and clear the query
// 4. Fetch the fonts from the API using the model in the store and save them in the store

// 5. Czll router replace in a watcher and update the query

// 6. The value of the select should only be the one that triggers a new API call to google servers
// 7. Any other input value just filters the fonts in the store

// 8. Once font list is fetched, before rendering 10 families: we iterate through them and check
// if the downloaded font is in the db, if there is, we create a FontFace rule. If not, we fetch
// the fonts and save them to the DB as arrayBuffer by creating a key with FamilyName_variant and
// create a new FontFace rule from it. For simplicity we only allow 300, regualar, 500, 600, 700.
// (this should be filtered when preparing fonts)
// Repeat the procedure when the observer callback is triggered and whenever any input changes.

const store = useStore()

watchEffect(() => {
   console.log(store.editor.sortCriteriaModel)
   console.log(store.editor.globalFontSize)
   console.log(store.editor.searchValueModel)
})

async function onAsyncChange(value: string) {
   await new Promise((resolve) => setTimeout(resolve, 1000))
   console.log('asyncChange', value)
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
               :isLoading="false"
            />
         </div>

         <!-- Font Size -->

         <div class="Fieldset Fielset_GapEffect">
            <label class="Fieldset_Label" :for="fontSizeRangeId">Global Size</label>
            <RangeSlider
               :id="fontSizeRangeId"
               :steps="FONT_SIZE_OPTIONS"
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
            <RadioGroup
               v-model="store.editor.activeCategoryModel"
               :options="EDITOR_CATEGORIES"
            />
         </div>

         <!-- Variants -->

         <div
            class="Fieldset Fielset_GapEffect"
            role="radiogroup"
            :aria-labelledby="variantLabelId"
         >
            <legend :id="variantLabelId" class="Fieldset_Label">Variants</legend>
            <RadioGroup v-model="store.editor.activeVariantModel" :options="EDITOR_VARIANTS" />
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
