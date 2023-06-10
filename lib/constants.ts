import type { DBVariantTarget } from '@/types/db'
import type { GoogleAPISortCriteria } from '@/types/fetch'
import type {
   StorePreviewTypes,
   StoreEditorFontSizes,
   AppFontCategories,
   AppFontWeights
} from '@/types/store'

export enum StoreEditingStatus {
   SAVING,
   SAVED,
   ERROR
}

/* Query */

export const EDITOR_QUERY_KEYS = {
   category: 'category',
   sort: 'sort',
   fontsize: 'fontsize'
}

export const PREVIEW_TYPE_QUERY_KEY = 'preview'

/* UI */

export const SORT_CRITERIA: readonly { label: string; value: GoogleAPISortCriteria }[] = [
   { label: 'Popularity', value: 'popularity' },
   { label: 'Trending', value: 'trending' },
   { label: 'Alphabetical', value: 'alpha' },
   { label: 'Last updated', value: 'date' }
]

export const EDITOR_CATEGORIES: readonly { label: string; value: AppFontCategories }[] = [
   { label: 'Sans', value: 'sans' },
   { label: 'Serif', value: 'serif' },
   { label: 'Display', value: 'display' },
   { label: 'Script', value: 'handwriting' },
   { label: 'Condensed', value: 'condensed' }
]

export const PREVIEW_OPTIONS: {
   label: string
   value: StorePreviewTypes
}[] = [
   { label: 'Business Card', value: 'business-card' },
   { label: 'Letterhead', value: 'letterhead' },
   { label: 'SaaS Website', value: 'website' }
]

export const FONT_SIZE_OPTIONS: readonly StoreEditorFontSizes[] = [
   '2rem',
   '3rem',
   '4rem',
   '5rem',
   '6rem'
]

/* DB */

export const DB_NAME = 'wcm_app'
export const DB_STORE_NAME = 'wcm_fonts'

export const DB_COMBINATION_KEY = 'wcm_combination'

export const DEFAULT_FONTS: Record<DBVariantTarget, string> = {
   headline: 'Roboto',
   body: 'Roboto'
}

export const DEFAULT_WEIGHTS: Record<DBVariantTarget, AppFontWeights> = {
   headline: '400',
   body: '400'
}

/* API */

export const API_GOOGLE_FONTS_BASEURL = 'https://www.googleapis.com/webfonts/v1/webfonts'

export const APP_CRITICAL_ERROR = 'Critical error.'
