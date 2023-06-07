import type { GoogleAPISortCriteria } from '@/types/fetch'
import type {
   StorePreviewTypesPrint,
   StorePreviewTypesDigital,
   StoreEditorFontSizes
} from '@/types/store'

export enum StoreEditingStatus {
   UNSAVED,
   SAVING,
   SAVED,
   ERROR
}

/* UI */

export const SORT_CRITERIA: readonly { label: string; value: GoogleAPISortCriteria }[] = [
   { label: 'Popularity', value: 'popularity' },
   { label: 'Alphabetical', value: 'alpha' },
   { label: 'Last updated', value: 'date' },
   { label: 'Trending', value: 'trending' }
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

export const LANGUAGE_PREVIEW_OPTIONS: readonly { label: string; value: string }[] = [
   { label: 'English', value: 'eng' },
   { label: 'Spanish', value: 'spa' }
]

export const FONT_SIZE_OPTIONS: readonly StoreEditorFontSizes[] = [
   '0.75rem',
   '1rem',
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

/* API */

export const API_GOOGLE_FONTS_BASEURL = 'https://www.googleapis.com/webfonts/v1/webfonts'

export const API_RANDOM_WORDS_BASEURL = 'https://random-word-api.herokuapp.com/word'
