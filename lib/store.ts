import { db } from './db'
import {
   SORT_CRITERIA,
   DIGITAL_PREVIEW_OPTIONS,
   StoreEditingStatus,
   LANGUAGE_PREVIEW_OPTIONS
} from './constants'

import type { GoogleFont } from '@/types/fetch'
import type { StoreEditor, StorePreview, StoreFonts, StoreEditorTabs } from '@/types/store'
import type { DBFontFamilyData } from '@/types/db'

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

   /* Editor */

   const editor: StoreEditor = reactive<StoreEditor>({
      activeId: undefined,
      activeName: undefined,
      activeTab: 'fonts',
      assignedHeadlineFont: undefined,
      assignedBodyFont: undefined,
      editingStatus: StoreEditingStatus.UNSAVED,
      searchValueModel: '',
      inputValueModel: 'De gustibus non est disputandum.',
      fontSizeModel: '1rem',
      sortCriteriaModel: SORT_CRITERIA[0].value,
      activeCategoryModel: 'sans',
      activeVariantModel: 'normal',
      activeFontsComputed: computed(() => {
         if (!fonts.value) return []

         const activeVariant =
            fonts.value[editor.activeCategoryModel][editor.activeVariantModel]

         if (!editor.searchValueModel) return activeVariant

         return activeVariant.filter(({ family }) =>
            family.toLowerCase().includes(editor.searchValueModel.toLowerCase())
         )
      }) as unknown as GoogleFont[],
      actions: {
         setActiveId(id: string) {
            editor.activeId = id
         },
         setActiveName(name: string) {
            editor.activeName = name
         },
         setEditingStatus(status: StoreEditingStatus) {
            editor.editingStatus = status
         },
         setActiveTab(view: StoreEditorTabs) {
            editor.activeTab = view
         },
         async assignFont(target: 'headline' | 'body', { family, weight }: DBFontFamilyData) {
            editor.editingStatus = StoreEditingStatus.SAVING

            if (target === 'headline') editor.assignedHeadlineFont = { family, weight }
            if (target === 'body') editor.assignedBodyFont = { family, weight }

            if (!editor.activeId) return

            try {
               await db.update(editor.activeId, {
                  [target]: { family, weight }
               })
               editor.editingStatus = StoreEditingStatus.SAVED
            } catch (error) {
               console.error(error)
               editor.editingStatus = StoreEditingStatus.ERROR
            }
         }
      }
   })

   /* Preview */

   const preview: StorePreview = reactive<StorePreview>({
      headlineFont: { family: 'Roboto', weight: '700' },
      bodyFont: { family: 'Roboto', weight: '400' },
      typeModel: DIGITAL_PREVIEW_OPTIONS[0].value,
      languageModel: LANGUAGE_PREVIEW_OPTIONS[0].value,
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
         actions: { setFonts }
      },
      editor,
      preview
   }
}
