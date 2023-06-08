import { useStore } from '@/lib/store'
import { useUpdateQuery } from '@/lib/useUpdateQuery'
import { validateQueryParam as isValid } from '@/lib/utils'

import {
   SORT_CRITERIA,
   EDITOR_CATEGORIES as CATEGORIES,
   EDITOR_VARIANTS as VARIANTS,
   EDITOR_QUERY_KEYS as QUERY_KEYS,
   FONT_SIZE_OPTIONS
} from '@/lib/constants'

import type { StoreEditorFontSizes, AppFontCategories, AppFontVariants } from '@/types/store'
import type { GoogleAPISortCriteria } from '@/types/fetch'

export function useEditorQuery() {
   const store = useStore()
   const route = useRoute()
   const updateQuery = useUpdateQuery()

   // On Page Load

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
      store.editor.actions.setGlobalFontSize(
         route.query[QUERY_KEYS.fontsize] as StoreEditorFontSizes
      )
   } else {
      updateQuery(QUERY_KEYS.fontsize, FONT_SIZE_OPTIONS[5])
   }

   // On page update

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
}
