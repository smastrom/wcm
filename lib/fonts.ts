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

function getAppFontVariants(fonts: GoogleFont[], categoryName: GoogleAPIFontCateogry) {
   const category = fonts.filter(({ category }) => category === categoryName)

   return {
      normal: category.filter(({ variants }) => variants.includes('regular')),
      italic: category.filter(({ variants }) => variants.includes('italic')),
      condensed: category.filter(({ family }) => family.includes('Condensed'))
   }
}

/** Prepares fonts to save in the Vue app. */
export function prepareFonts(fonts: GoogleFont[]) {
   fonts = prepareFontsWithoutDupes(fonts, 'Noto', 'Noto Sans', 'Noto Serif', 'IBM Plex Sans')

   return {
      sans: getAppFontVariants(fonts, 'sans-serif'),
      display: getAppFontVariants(fonts, 'display'),
      serif: getAppFontVariants(fonts, 'serif'),
      handwriting: getAppFontVariants(fonts, 'handwriting')
   }
}
