import { db } from './db'
import { formatDistanceToNow } from 'date-fns'
import { fetchFonts } from './fetch'
import { prepareFonts } from './fonts'
import {
   SORT_CRITERIA,
   DIGITAL_PREVIEW_OPTIONS,
   StoreEditingStatus,
   APP_CRITICAL_ERROR,
   EDITOR_CATEGORIES,
   DEFAULT_FONTS,
   DEFAULT_WEIGHTS
} from './constants'

import type { GoogleAPISortCriteria, GoogleFont } from '@/types/fetch'
import type {
   StoreEditor,
   StorePreview,
   StoreFonts,
   StoreEditorFontSizes,
   AppFontCategories
} from '@/types/store'
import type { DBFontFamilyData, DBCombination } from '@/types/db'

export const storeInjectionKey = Symbol('')

export function useStore() {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

export function createStore() {
   /**
    * Fonts */

   const fonts = shallowRef<StoreFonts | null>(null)

   function setFonts(value: StoreFonts) {
      fonts.value = value
   }

   async function fetchAndSetFonts(sortCriteria: GoogleAPISortCriteria) {
      try {
         const googleFonts = await fetchFonts({ sort: sortCriteria, capability: 'WOFF2' })
         if (googleFonts) {
            const appFonts = prepareFonts(googleFonts)
            setFonts(appFonts)
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
      globalFontSize: '4rem',
      editingStatus: StoreEditingStatus.SAVED,
      searchValueModel: '',
      sortCriteriaModel: SORT_CRITERIA[0].value,
      activeCategoryModel: EDITOR_CATEGORIES[0].value,
      activeFontsComputed: computed(() => {
         if (!fonts.value) return []

         const activeCategory = fonts.value?.[editor.activeCategoryModel]

         if (!editor.searchValueModel) return activeCategory

         return activeCategory.filter(({ family }) =>
            family.toLowerCase().includes(editor.searchValueModel.toLowerCase())
         )
      }) as unknown as GoogleFont[],
      actions: {
         setIsLoadingAllFonts(status: boolean) {
            editor.isLoadingAllFonts = status
         },
         setActiveId(id: string) {
            editor.activeId = id
         },
         setActiveName(name: string) {
            editor.activeName = name
         },
         setEditingStatus(status: StoreEditingStatus) {
            editor.editingStatus = status
         },
         setGlobalFontSize(size: StoreEditorFontSizes) {
            editor.globalFontSize = size
         },
         setLastUpdated(timestamp: number) {
            editor.lastUpdated = `${formatDistanceToNow(timestamp)} ago`
         },
         setAssignedFont(target: 'headline' | 'body', data: DBFontFamilyData) {
            if (target === 'headline') editor.assignedHeadlineFont = data
            if (target === 'body') editor.assignedBodyFont = data
         },
         setCurrentEntry(data: DBCombination) {
            this.setActiveId(data.id)
            this.setActiveName(data.name)
            this.setAssignedFont('headline', data.headline)
            this.setAssignedFont('body', data.body)
            this.setLastUpdated(data.lastUpdated)
         },
         setActiveCategory(category: AppFontCategories) {
            editor.activeCategoryModel = category
         },
         setSortCriteria(criteria: GoogleAPISortCriteria) {
            editor.sortCriteriaModel = criteria
         },
         async saveFontToDB(target: 'headline' | 'body', { family, weight }: DBFontFamilyData) {
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
               console.log(family, weight)
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
      headlineFont: { family: DEFAULT_FONTS.headline, weight: DEFAULT_WEIGHTS.headline },
      bodyFont: { family: DEFAULT_FONTS.body, weight: DEFAULT_WEIGHTS.body },
      typeModel: DIGITAL_PREVIEW_OPTIONS[0].value,
      isFullScreen: false,
      isProducingCanvas: false,
      actions: {
         toggleFullScreen() {
            preview.isFullScreen = !preview.isFullScreen
         },
         toggleCanvas() {
            preview.isProducingCanvas = !preview.isProducingCanvas
         },
         setHeadlineFont({ family, weight }) {
            preview.headlineFont = { family, weight }
         },
         setBodyFont({ family, weight }) {
            preview.bodyFont = { family, weight }
         }
      }
   })

   return {
      fonts: {
         data: fonts,
         actions: { setFonts, fetchAndSetFonts }
      },
      editor,
      preview
   }
}
