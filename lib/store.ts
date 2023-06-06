import { DIGITAL_PREVIEW_OPTIONS, EditingStatus, LANGUAGE_PREVIEW_OPTIONS } from './constants'
import { SORT_CRITERIA } from '@/lib/constants'
import { getCheckedValues } from '@/lib/utils'

import type { StoreEditor, StorePreview } from '@/types/store'

export const storeInjectionKey = Symbol('')

export function useStore() {
   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

export function createStore() {
   const editor: StoreEditor = reactive({
      searchValue: '',
      inputValue: '',
      fontSize: '1rem',
      currentlyEditing: undefined,
      editingStatus: EditingStatus.UNSAVED,
      sortCriteria: SORT_CRITERIA[0].value,
      fontTypes: {
         sans: true,
         serif: false
      },
      fontVariants: {
         normal: true,
         italic: false,
         condensed: false
      },
      computed: {
         selectedFontTypes: computed(() => getCheckedValues(editor.fontTypes)),
         selectedFontVariants: computed(() => getCheckedValues(editor.fontVariants))
      },
      actions: {}
   })

   const preview: StorePreview = reactive<StorePreview>({
      type: DIGITAL_PREVIEW_OPTIONS[0].value,
      language: LANGUAGE_PREVIEW_OPTIONS[0].value,
      isFullScreen: false,
      isProducingCanvas: false,
      actions: {
         toggleFullScreen() {
            preview.isFullScreen = !preview.isFullScreen
         },
         toggleCanvas() {
            preview.isProducingCanvas = !preview.isProducingCanvas
         }
      }
   })

   return { editor, preview }
}
