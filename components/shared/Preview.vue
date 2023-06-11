<script setup lang="ts">
import PreviewHeader from './PreviewHeader.vue'
import PreviewContentSwitcher from './PreviewContentSwitcher.vue'
import PreviewContent from './PreviewContent.vue'

import { PREVIEW_TYPE_QUERY_KEY } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { useUpdateQuery } from '@/lib/useUpdateQuery'
import { validateQueryParam as isValid } from '@/lib/utils'
import { PREVIEW_OPTIONS } from '@/lib/constants'
import { useViewport } from '@/lib/useViewport'

import type { StorePreviewTypes } from '@/types/store'

const route = useRoute()
const store = useStore()
const updateQuery = useUpdateQuery()

const { isMatch: isMobile } = useViewport('1100px')

// Restore query

if (
   isValid(
      route.query[PREVIEW_TYPE_QUERY_KEY],
      PREVIEW_OPTIONS.map(({ value }) => value)
   )
) {
   store.preview.actions.setPreviewExample(route.query[PREVIEW_TYPE_QUERY_KEY] as StorePreviewTypes)
} else {
   await updateQuery(PREVIEW_TYPE_QUERY_KEY, store.preview.exampleModel)
}

// Update query

watch(
   () => store.preview.exampleModel,
   (newValue) => updateQuery(PREVIEW_TYPE_QUERY_KEY, newValue)
)
</script>

<template>
   <div class="Preview_Wrapper" v-if="!isMobile">
      <PreviewHeader v-if="route.name === 'editor'" />
      <PreviewContentSwitcher />
      <PreviewContent />
   </div>
</template>

<style scoped>
.Preview_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-4);
   overflow-y: auto;
   overflow-x: hidden;
   min-width: calc(450px + var(--size-8));
   height: 100%;

   @media (--layout-switch) {
      display: none;
   }
}
</style>
