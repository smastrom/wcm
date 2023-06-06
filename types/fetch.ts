export type GoogleAPISortCriteria = 'alpha' | 'date' | 'popularity' | 'trending'

interface GoogleFont {
   category: string
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
