import fileSaver from 'file-saver'

import { API_GOOGLE_FONTS_BASEURL, SORT_CRITERIA } from '@/lib/constants'

import type { AppFontWeights } from '@/types/store'
import type {
   GoogleAPIResponse,
   GoogleAPISortCriteria,
   GoogleAPIResponseError,
   GoogleAPIWeights
} from '@/types/fetch'

/**
 *
 * Fetch fonts from Google Fonts API.
 * This is called whenever user selects a new sort criteria and top-level in routes
 * using the criteria from the query/store.
 */
export async function fetchFonts({
   sort = SORT_CRITERIA[0].value,
   capability,
   family
}: {
   sort?: GoogleAPISortCriteria
   capability?: string
   family?: string
} = {}): Promise<null | GoogleAPIResponse['items']> {
   const query = new URLSearchParams({
      key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
      sort,
      subset: 'latin',
      ...(capability ? { capability } : {}), // Google can provide TTF only if undefined
      ...(family ? { family } : {})
   })

   try {
      const res = await fetch(API_GOOGLE_FONTS_BASEURL + '?' + query.toString())
      const data = await res.json()

      if ('error' in (data as GoogleAPIResponseError)) {
         throw new Error(data.error.message)
      }
      return (data as GoogleAPIResponse).items
   } catch (error) {
      console.log(error)
      throw new Error('[fetch-fonts] - Error fetching fonts.')
   }
}

/** This is called when the user clicks the download button and download 2 files. */
export async function downloadSingleFonts(family: string, weight: AppFontWeights) {
   try {
      const googleWeight: GoogleAPIWeights = weight === '400' ? 'regular' : weight

      const ttfFont = await fetchFonts({ family })
      if (ttfFont) fileSaver(ttfFont[0].files[googleWeight], `${family}-${googleWeight}.ttf`)

      const woff2Font = await fetchFonts({ family, capability: 'WOFF2' })
      if (woff2Font) {
         fileSaver(woff2Font[0].files[googleWeight], `${family}-web-${googleWeight}.woff2`)
      }
   } catch (error) {
      console.log(error)
      throw new Error('[download-single-fonts] - Error fetching single fonts.')
   }
}
