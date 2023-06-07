export type GoogleAPISortCriteria = 'alpha' | 'date' | 'popularity' | 'trending'

export type GoogleAPIFontCateogry =
   | 'display'
   | 'handwriting'
   | 'sans-serif'
   | 'serif'
   | 'monospace'

export interface GoogleFont {
   category: GoogleAPIFontCateogry
   family: string
   files: Record<string, string>
   kind: string
   lastModified: string
   subsets: string[]
   variants: string[]
   menu: string
}

export interface GoogleAPIResponse {
   kind: GoogleFont['kind']
   items: GoogleFont[]
}

export type RandomWordsAPILanguages = 'en' | 'es' | 'it' | 'de'
