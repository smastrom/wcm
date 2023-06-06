import { EditingStatus } from '@/lib/constants'
import type { GoogleAPISortCriteria } from '@/types/api'

/* Editor */

export type StoreEditorFontSizes = '1rem' | '2rem' | '3rem'

export interface StoreEditor {
   searchValue: string
   inputValue: string
   fontSize: StoreEditorFontSizes
   currentlyEditing: string | undefined
   editingStatus: EditingStatus
   sortCriteria: GoogleAPISortCriteria
   fontTypes: {
      sans: boolean
      serif: boolean
   }
   fontVariants: {
      normal: boolean
      italic: boolean
      condensed: boolean
   }
   computed: {
      selectedFontTypes: string[]
      selectedFontVariants: string[]
   }
   actions: {}
}

/* Preview */

export type DigitalPreview = 'blog-post' | 'saas'
export type PrintPreview = 'business-card' | 'letterhead'

export type PreviewTypes = DigitalPreview | PrintPreview

export interface StorePreview {
   type: PreviewTypes | undefined
   language: string
   isFullScreen: boolean
   isProducingCanvas: boolean
   actions: {
      toggleFullScreen(): void
      toggleCanvas(): void
   }
}
