import { StoreEditingStatus } from '@/lib/constants'

import type { GoogleFont, GoogleAPISortCriteria, GoogleAPIWeights } from '@/types/fetch'
import type { DBCombination, DBFontFamilyData } from '@/types/db'

/* Fonts */

export type AppFontCategories = 'sans' | 'display' | 'serif' | 'handwriting' | 'condensed'

export type AppFontWeights = Exclude<GoogleAPIWeights, 'regular'> | '400'

export interface AppFont extends GoogleFont {
   appWeights: AppFontWeights[]
}

export type CategorizedAppFonts = Record<AppFontCategories, AppFont[]>

/* Editor */

export type StoreEditorFontSizes = '2rem' | '3rem' | '4rem' | '5rem' | '6rem'

export interface StoreEditor {
   isLoadingAllFonts: boolean
   activeId: string | undefined
   activeName: string | undefined
   lastUpdated: string | undefined
   assignedHeadlineFont: DBFontFamilyData | undefined
   assignedBodyFont: DBFontFamilyData | undefined
   editingStatus: StoreEditingStatus
   globalFontSize: StoreEditorFontSizes
   searchValueModel: string
   sortCriteriaModel: GoogleAPISortCriteria
   activeCategoryModel: AppFontCategories
   activeFontsComputed: AppFont[]
   actions: {
      setIsLoadingAllFonts(status: boolean): void
      setActiveId(id: string): void
      setActiveName(name: string): void
      setEditingStatus(status: StoreEditingStatus): void
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

export type StorePreviewTypes = 'blog-post' | 'website' | 'business-card' | 'letterhead'

export interface StorePreview {
   headlineFont: DBFontFamilyData
   bodyFont: DBFontFamilyData
   exampleModel: StorePreviewTypes
   isFullScreen: boolean
   isProducingCanvas: boolean
   actions: {
      toggleFullScreen(): void
      toggleCanvas(): void
      setHeadlineFont: (data: DBFontFamilyData) => void
      setBodyFont: (data: DBFontFamilyData) => void
      setPreviewExample(example: StorePreviewTypes): void
   }
}
