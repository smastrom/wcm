import type { GoogleFont, GoogleAPIFontCateogry } from '@/types/fetch'

/** Removes language-specific duplicates, e.g. remove 'Noto Sans Thai' but keep 'Noto Sans' */
function prepareFontsWithoutDupes(fonts: GoogleFont[], ...familyNames: string[]) {
   return fonts.filter(
      ({ family }) =>
         !familyNames.some(
            (familyToRemove) => family.startsWith(familyToRemove) && family !== familyToRemove
         )
   )
}

function getGoogleCategory(fonts: GoogleFont[], categoryName: GoogleAPIFontCateogry) {
   return fonts.filter(({ category }) => category === categoryName)
}

/** Prepares fonts to save in the Vue app. */
export function prepareFonts(fonts: GoogleFont[]) {
   fonts = prepareFontsWithoutDupes(fonts, 'Noto', 'Noto Sans', 'Noto Serif', 'IBM Plex Sans')

   const sans = getGoogleCategory(fonts, 'sans-serif')

   return {
      sans,
      display: getGoogleCategory(fonts, 'display'),
      serif: getGoogleCategory(fonts, 'serif'),
      handwriting: getGoogleCategory(fonts, 'handwriting'),
      condensed: sans.filter(({ family }) => family.includes('Condensed'))
   }
}
