import type { DBVariantTarget } from '@/types/db'
import type { GoogleAPISortCriteria } from '@/types/fetch'
import type {
   StorePreviewTypesPrint,
   StorePreviewTypesDigital,
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

export const PRINT_PREVIEW_OPTIONS: readonly {
   label: string
   value: StorePreviewTypesPrint
}[] = [
   { label: 'Business Card', value: 'business-card' },
   { label: 'Letterhead', value: 'letterhead' }
]

export const DIGITAL_PREVIEW_OPTIONS: readonly {
   label: string
   value: StorePreviewTypesDigital
}[] = [
   { label: 'Blog Post', value: 'blog-post' },
   { label: 'SaaS Website', value: 'saas' }
]

export const PREVIEW_OPTIONS = [...PRINT_PREVIEW_OPTIONS, ...DIGITAL_PREVIEW_OPTIONS]

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
