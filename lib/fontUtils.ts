import { toAppWeight } from './utils'

import type { GoogleFont, GoogleAPIFontCateogry, GoogleAPIWeights } from '@/types/fetch'
import type { AppFontWeights, AppFont, CategorizedAppFonts } from '@/types/store'

const unallowedFamilies = ['Press Start 2P', 'Rubik 80s Fade']
const unallowedPrefixes = ['Baloo', 'Libre Barcode']

const allowedWeights: GoogleAPIWeights[] = ['300', 'regular', '500', '700']

/** Removes language-specific duplicates, e.g. remove 'Noto Sans Thai' but keep 'Noto Sans' */
function removeDupesFromFonts<T extends GoogleFont>(fonts: T[], ...familyNames: string[]): T[] {
   return fonts.filter(
      ({ family }) =>
         !familyNames.some(
            (familyToRemove) => family.startsWith(familyToRemove) && family !== familyToRemove
         )
   )
}

/** Some families are invalid in CSS even if Google returns them */
function removeBitmapFamilies(fonts: GoogleFont[]): GoogleFont[] {
   return fonts.filter(
      ({ family }) =>
         !unallowedFamilies.includes(family) &&
         !unallowedPrefixes.some((prefix) => family.startsWith(prefix))
   )
}

function getGoogleCategory(fonts: AppFont[], categoryName: GoogleAPIFontCateogry): AppFont[] {
   return fonts.filter(({ category }) => category === categoryName)
}

/** Removes unsupported weights and adds a list of all app weights available */
function prepareWeights(fonts: GoogleFont[]): AppFont[] {
   return fonts.map(({ files, ...font }) => {
      const newFiles = {} as Record<AppFontWeights, string>
      let newFont = {} as AppFont

      for (const weight of allowedWeights) {
         if (files[weight]) {
            const keyName = toAppWeight(weight)
            newFiles[keyName] = files[weight]
         }

         newFont = {
            ...font,
            files: newFiles,
            appWeights: Object.keys(newFiles) as AppFontWeights[]
         }
      }

      return newFont
   })
}

/** Prepares fonts to save in the Vue app. */
export function prepareFonts(fonts: GoogleFont[]): CategorizedAppFonts {
   fonts = removeBitmapFamilies(fonts)
   fonts = removeDupesFromFonts(fonts, 'Noto', 'Noto Sans', 'Noto Serif', 'IBM Plex Sans')
   fonts = prepareWeights(fonts)

   const sans = getGoogleCategory(fonts as AppFont[], 'sans-serif')

   return {
      sans,
      display: getGoogleCategory(fonts as AppFont[], 'display'),
      serif: getGoogleCategory(fonts as AppFont[], 'serif'),
      handwriting: getGoogleCategory(fonts as AppFont[], 'handwriting'),
      condensed: sans.filter(({ family }) => family.includes('Condensed'))
   }
}

/** Gets a specific family from the categorized fonts array */
export function getFamily(appFonts: CategorizedAppFonts, family: string): AppFont {
   const appFamily = Object.values(appFonts)
      .flat()
      .find(({ family: f }) => f === family)

   if (!appFamily) throw new Error(`[get-family] - ${family} not found.`)

   return appFamily
}
