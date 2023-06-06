import { API_GOOGLE_FONTS_BASEURL } from '@/lib/constants'

import type { GoogleAPISortCriteria } from '@/types/fetch'

export async function fetchFonts(sort: GoogleAPISortCriteria = 'popularity') {
   const query = new URLSearchParams({
      key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
      sort,
      capability: 'WOFF2',
      subset: 'latin'
   })

   try {
      const res = await fetch(API_GOOGLE_FONTS_BASEURL + '?' + query.toString())
      const data = await res.json()
      return data
   } catch (error) {
      console.error(error)
      return null
   }
}
