<script setup lang="ts">
import { PREVIEW_OPTIONS } from '@/lib/constants'
import { useStore } from '@/lib/store'

import Select from './Select.vue'
import { randomID } from '@/lib/utils'

const store = useStore()

const previewTypeId = randomID()

watch(
   () => store.preview.exampleModel,
   (value) => console.log(value)
)
</script>

<template>
   <nav class="Switcher_Wrapper">
      <label class="Fieldset_Label" :for="previewTypeId">Switch Preview</label>

      <Select
         :isAsync="false"
         :id="previewTypeId"
         :options="PREVIEW_OPTIONS"
         v-model="store.preview.exampleModel"
      />
   </nav>
</template>

<style scoped>
.Switcher_Wrapper {
   display: flex;
   gap: var(--size-2);
   flex-direction: column;
}

.Fieldset_Label {
   font-size: var(--font-size-0);
   font-weight: 700;
}
</style>
