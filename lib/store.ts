import { db } from './db'
import { formatDistanceToNow } from 'date-fns'
import { fetchFonts } from './fetch'
import { prepareFonts } from './fonts'
import {
   SORT_CRITERIA,
   StoreEditingStatus,
   APP_CRITICAL_ERROR,
   EDITOR_CATEGORIES,
   PREVIEW_OPTIONS,
   DEFAULT_HEADLINE_FONT,
   DEFAULT_BODY_FONT
} from './constants'

import type { GoogleAPISortCriteria } from '@/types/fetch'
import type {
   StoreEditor,
   StorePreview,
   CategorizedAppFonts,
   StoreEditorFontSizes,
   AppFontCategories,
   AppFont,
   PreviewComputedStyles
} from '@/types/store'
import type { DBFontFamilyData, DBCombination, DBVariantTarget } from '@/types/db'

export const storeInjectionKey = Symbol('')

export function useStore() {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

export function createStore() {
   /**
    * Fonts */

   const appFonts = shallowRef<CategorizedAppFonts | null>(null)

   function setFonts(value: CategorizedAppFonts) {
      appFonts.value = value
   }

   async function fetchAndSetFonts(sortCriteria: GoogleAPISortCriteria) {
      try {
         const googleFonts = await fetchFonts({ sort: sortCriteria, capability: 'WOFF2' })
         if (googleFonts) {
            const categorizedFonts = prepareFonts(googleFonts)
            setFonts(categorizedFonts)
         }
      } catch (error) {
         throw new Error(`[store-set-fonts] - ${APP_CRITICAL_ERROR}`)
      }
   }

   /* Editor */

   const editor: StoreEditor = reactive<StoreEditor>({
      activeId: undefined,
      activeName: undefined,
      lastUpdated: undefined,
      assignedHeadlineFont: undefined,
      assignedBodyFont: undefined,
      isLoadingAllFonts: false,
      globalFontSize: window.innerWidth <= 480 + 1 ? '2rem' : '4rem',
      editingStatus: StoreEditingStatus.SAVED,
      searchValueModel: '',
      sortCriteriaModel: SORT_CRITERIA[0].value,
      activeCategoryModel: EDITOR_CATEGORIES[0].value,
      activeFontsComputed: computed(() => {
         if (!appFonts.value) return []

         const activeCategory = appFonts.value?.[editor.activeCategoryModel]

         if (!editor.searchValueModel) return activeCategory

         return activeCategory.filter(({ family }) =>
            family.toLowerCase().includes(editor.searchValueModel.toLowerCase())
         )
      }) as unknown as AppFont[],
      actions: {
         setIsLoadingAllFonts(status: boolean) {
            editor.isLoadingAllFonts = status
         },
         setActiveId(id: string | undefined) {
            editor.activeId = id
         },
         setActiveName(name: string | undefined) {
            editor.activeName = name
         },
         setEditingStatus(status: StoreEditingStatus) {
            editor.editingStatus = status
         },
         setGlobalFontSize(size: StoreEditorFontSizes) {
            editor.globalFontSize = size
         },
         setLastUpdated(timestamp: number) {
            if (!timestamp) return
            editor.lastUpdated = `${formatDistanceToNow(timestamp)} ago`
         },
         setAssignedFont(target: DBVariantTarget, data: DBFontFamilyData) {
            if (target === 'headline') editor.assignedHeadlineFont = data
            if (target === 'body') editor.assignedBodyFont = data
         },
         /** This runs on mount in the editor after fetching combination data from DB */
         setCurrentEntry(data: DBCombination) {
            this.setActiveId(data.id)
            this.setActiveName(data.name)
            this.setLastUpdated(data.lastUpdated)

            this.setAssignedFont('headline', data.headline)
            this.setAssignedFont('body', data.body)
            preview.actions.setHeadlineFont(data.headline)
            preview.actions.setBodyFont(data.body)
         },
         resetCurrentEntry() {
            this.setActiveId(undefined as unknown as string)
            this.setActiveName(undefined as unknown as string)
            this.setLastUpdated(Date.now())

            this.setAssignedFont('headline', DEFAULT_HEADLINE_FONT)
            this.setAssignedFont('body', DEFAULT_BODY_FONT)
            preview.actions.setHeadlineFont(DEFAULT_HEADLINE_FONT)
            preview.actions.setBodyFont(DEFAULT_BODY_FONT)
         },
         setActiveCategory(category: AppFontCategories) {
            editor.activeCategoryModel = category
         },
         setSortCriteria(criteria: GoogleAPISortCriteria) {
            editor.sortCriteriaModel = criteria
         },
         setSearchValue(value: string) {
            editor.searchValueModel = value
         },
         async saveFontToDB(target: DBVariantTarget, { family, weight }: DBFontFamilyData) {
            this.setEditingStatus(StoreEditingStatus.SAVING)

            if (!editor.assignedBodyFont || !editor.assignedHeadlineFont || !editor.activeId) return

            const prevValue =
               target === 'headline'
                  ? { ...editor.assignedHeadlineFont }
                  : { ...editor.assignedBodyFont }

            try {
               const entry = await db.update(editor.activeId, {
                  [target]: { family, weight }
               })

               this.setLastUpdated(entry.lastUpdated)
               this.setEditingStatus(StoreEditingStatus.SAVED)
               this.setAssignedFont(target, { family, weight })
            } catch (error) {
               this.setEditingStatus(StoreEditingStatus.ERROR)
               this.setAssignedFont(target, prevValue)
               throw new Error(`[store-save-font-to-db] - Error saving to DB`)
            }
         }
      }
   })

   /* Preview */

   const preview: StorePreview = reactive<StorePreview>({
      activeId: undefined,
      headlineFont: DEFAULT_HEADLINE_FONT,
      bodyFont: DEFAULT_BODY_FONT,
      exampleModel: PREVIEW_OPTIONS[0].value,
      computedStyles: computed(() => ({
         headline: {
            'font-family': preview.headlineFont.family,
            'font-weight': preview.headlineFont.weight
         },
         body: {
            'font-family': preview.bodyFont.family,
            'font-weight': preview.bodyFont.weight
         }
      })) as unknown as PreviewComputedStyles,
      actions: {
         setActiveId(id: string) {
            preview.activeId = id
         },
         setHeadlineFont(fontData) {
            preview.headlineFont = fontData
         },
         setBodyFont(fontData) {
            preview.bodyFont = fontData
         },
         setPreviewExample(exampleName) {
            preview.exampleModel = exampleName
         }
      }
   })

   return {
      fonts: {
         data: appFonts,
         actions: { setFonts, fetchAndSetFonts }
      },
      editor,
      preview
   }
}
