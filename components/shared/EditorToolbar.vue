<script setup lang="ts">
import { useStore } from '@/lib/store'
import { SORT_CRITERIA } from '@/lib/constants'

import RangeSlider from './RangeSlider.vue'
import RadioGroup from './RadioGroup.vue'
import Select from './Select.vue'

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

const fontSizeRangeId = crypto.randomUUID()
const sortSelectId = crypto.randomUUID()

watchEffect(() => {
   console.log(store.editor.sortCriteriaModel)
})

async function onAsyncChange(value: string) {
   await new Promise((resolve) => setTimeout(resolve, 1000))
   console.log('asyncChange', value)
}
</script>

<template>
   <nav>
      <div>
         <label for="editor_search">Search fonts</label>
         <input
            type="text"
            id="editor_search"
            placeholder="Search fonts..."
            v-model="store.editor.searchValueModel"
         />
      </div>
      <div>
         <label :for="fontSizeRangeId">Global Size</label>
         <RangeSlider :id="fontSizeRangeId" />
      </div>

      <fieldset>
         <legend>Radio Group</legend>
         <RadioGroup
            v-model="store.editor.activeCategoryModel"
            :options="[
               {
                  label: 'Sans',
                  value: 'sans'
               },
               {
                  label: 'Serif',
                  value: 'serif'
               },
               {
                  label: 'Display',
                  value: 'display'
               },
               {
                  label: 'Handwriting',
                  value: 'handwriting'
               }
            ]"
         />
      </fieldset>
      <div>
         <label :for="sortSelectId">Sort by</label>
         <Select
            :isAsync="true"
            :id="sortSelectId"
            :options="SORT_CRITERIA"
            v-model="store.editor.sortCriteriaModel"
            @asyncChange="onAsyncChange"
            :isLoading="false"
         />
      </div>
   </nav>
</template>
