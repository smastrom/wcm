import { db } from './db'

import { isFirefox } from './utils'

import type { AppFont, AppFontWeights } from '@/types/store'

/** When a font buffer is saved to the DB we add the same key here to avoid useless refreshes */
export const injectedFonts = new Set<string>()

export function getMemoryOrDBInstanceKey(family: string, weight: AppFontWeights) {
   return `${family}_${weight}`.replace(/\s/g, '_')
}

/** Used to inject fonts when scrolling the editor explorer */
export async function injectEditorFonts(fonts: AppFont[]): Promise<void> {
   try {
      for (const font of fonts) {
         for (const weight in font.files) {
            // 1. This key is shared between memory and DB
            const key = getMemoryOrDBInstanceKey(font.family, weight as AppFontWeights)

            // 2. Exit if in memory
            if (injectedFonts.has(key)) continue

            // 3. Fetch from DB / Google
            const buffer = await db.getFontBuffer(key, font.files[weight])

            // 4. Inject FontFace
            await injectFontFace({
               key,
               family: font.family,
               weight: weight as AppFontWeights,
               buffer
            })
         }
      }
   } catch (err) {
      console.log(err)
      throw new Error('[get-explorer-fonts] - Error fetching fonts.')
   }
}

/** Gecko wants "" while webkit doesn't */
function getBrowserSpecificFamilyName(family: string) {
   return isFirefox ? `"${family}"` : family
}

/** Makes fonts available site-wide, equal to @font-face */
export async function injectFontFace({
   key,
   family,
   weight,
   buffer
}: {
   key: string
   family: string
   weight: AppFontWeights
   buffer: ArrayBuffer
}) {
   try {
      const familyName = getBrowserSpecificFamilyName(family)
      const fontFace = new FontFace(familyName, buffer, { weight, style: 'normal' })

      if (fontFace) {
         await fontFace.load()
         injectedFonts.add(key)
         document.fonts.add(fontFace)
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[inject-font] - Failed to inject font ${family} ${weight}`)
   }
}
