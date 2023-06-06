import type { GoogleAPISortCriteria } from '@/types/api'
import type { PrintPreview, DigitalPreview } from '@/types/store'

export enum EditingStatus {
   UNSAVED,
   SAVING,
   SAVED,
   ERROR
}

export const SORT_CRITERIA: { label: string; value: GoogleAPISortCriteria }[] = [
   { label: 'Popularity', value: 'popularity' },
   { label: 'Alphabetical', value: 'alpha' },
   { label: 'Last updated', value: 'date' },
   { label: 'Trending', value: 'trending' }
]

export const PRINT_PREVIEW_OPTIONS: { label: string; value: PrintPreview }[] = [
   { label: 'Business Card', value: 'business-card' },
   { label: 'Letterhead', value: 'letterhead' }
]

export const DIGITAL_PREVIEW_OPTIONS: { label: string; value: DigitalPreview }[] = [
   { label: 'Blog Post', value: 'blog-post' },
   { label: 'SaaS Website', value: 'saas' }
]

export const LANGUAGE_PREVIEW_OPTIONS = [
   { label: 'English', value: 'eng' },
   { label: 'Spanish', value: 'spa' }
]
