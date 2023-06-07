import { StoreEditingStatus } from '@/lib/constants'
import { DBFontFamilyData } from './db'

import type { GoogleFont, GoogleAPISortCriteria } from '@/types/fetch'

/* Fonts */

export type AppFontCategories = 'sans' | 'display' | 'serif' | 'handwriting'
export type AppFontVariants = 'normal' | 'italic' | 'condensed'

export type StoreFontVariants = Record<AppFontVariants, GoogleFont[]>
export type StoreFonts = Record<AppFontCategories, StoreFontVariants>

/* Editor */

export type StoreEditorFontSizes =
   | '0.75rem'
   | '0.875rem'
   | '1rem'
   | '2rem'
   | '3rem'
   | '4rem'
   | '5rem'
   | '6rem'

export type StoreEditorTabs = 'fonts' | 'combination'

export interface StoreEditor {
   activeId: string | undefined
   activeName: string | undefined
   activeTab: StoreEditorTabs
   assignedHeadlineFont: DBFontFamilyData | undefined
   assignedBodyFont: DBFontFamilyData | undefined
   editingStatus: StoreEditingStatus
   searchValueModel: string
   inputValueModel: string
   fontSizeModel: StoreEditorFontSizes
   sortCriteriaModel: GoogleAPISortCriteria
   activeCategoryModel: AppFontCategories
   activeVariantModel: AppFontVariants
   activeFontsComputed: GoogleFont[]
   actions: {
      setActiveId(id: string): void
      setActiveName(name: string): void
      setEditingStatus(status: StoreEditingStatus): void
      setActiveTab(view: StoreEditorTabs): void
      assignFont(target: 'headline' | 'body', data: DBFontFamilyData): Promise<void>
   }
}

/* Preview */

export type StorePreviewTypesDigital = 'blog-post' | 'saas'
export type StorePreviewTypesPrint = 'business-card' | 'letterhead'

export type StorePreviewTypes = StorePreviewTypesDigital | StorePreviewTypesPrint

export interface StorePreview {
   headlineFont: DBFontFamilyData
   bodyFont: DBFontFamilyData
   typeModel: StorePreviewTypes | undefined
   languageModel: string
   isFullScreen: boolean
   isProducingCanvas: boolean
   actions: {
      toggleFullScreen(): void
      toggleCanvas(): void
      setHeadlineFont: (data: DBFontFamilyData) => void
      setBodyFont: (data: DBFontFamilyData) => void
   }
}
