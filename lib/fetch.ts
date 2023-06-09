import { API_GOOGLE_FONTS_BASEURL } from '@/lib/constants'

import type {
   GoogleAPIResponse,
   GoogleAPISortCriteria,
   GoogleAPIResponseError
} from '@/types/fetch'

export async function fetchFonts(
   sort: GoogleAPISortCriteria = 'popularity'
): Promise<null | GoogleAPIResponse['items']> {
   const query = new URLSearchParams({
      key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
      sort,
      capability: 'WOFF2',
      subset: 'latin'
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
