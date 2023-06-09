import { StoreEditingStatus } from '@/lib/constants'

import type { GoogleFont, GoogleAPISortCriteria } from '@/types/fetch'
import type { DBCombination, DBFontFamilyData } from '@/types/db'

/* Fonts */

export type AppFontCategories = 'sans' | 'display' | 'serif' | 'handwriting' | 'condensed'

export type StoreFonts = Record<AppFontCategories, GoogleFont[]>

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
   lastUpdated: string | undefined
   assignedHeadlineFont: DBFontFamilyData | undefined
   assignedBodyFont: DBFontFamilyData | undefined
   activeTab: StoreEditorTabs
   editingStatus: StoreEditingStatus
   globalFontSize: StoreEditorFontSizes
   searchValueModel: string
   inputValueModel: string
   sortCriteriaModel: GoogleAPISortCriteria
   activeCategoryModel: AppFontCategories
   activeFontsComputed: GoogleFont[]
   actions: {
      setActiveId(id: string): void
      setActiveName(name: string): void
      setEditingStatus(status: StoreEditingStatus): void
      setActiveTab(view: StoreEditorTabs): void
      setAssignedFont(target: 'headline' | 'body', data: DBFontFamilyData): void
      setLastUpdated(timestamp: number): void
      setCurrentEntry(data: DBCombination): void
      saveFontToDB(target: 'headline' | 'body', data: DBFontFamilyData): Promise<void>
      setGlobalFontSize(size: StoreEditorFontSizes): void
      setActiveCategory(category: AppFontCategories): void
      setSortCriteria(criteria: GoogleAPISortCriteria): void
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
   isFullScreen: boolean
   isProducingCanvas: boolean
   actions: {
      toggleFullScreen(): void
      toggleCanvas(): void
      setHeadlineFont: (data: DBFontFamilyData) => void
      setBodyFont: (data: DBFontFamilyData) => void
   }
}
