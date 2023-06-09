import indexedDB from 'localforage'

import { isFirefox } from './utils'

import type { GoogleAPIWeights, GoogleFont } from '@/types/fetch'
import type { AppFontWeights } from '@/types/store'

export interface ExplorerFonts extends GoogleFont {
   cssWeights: AppFontWeights[]
}

const allowedWeights: GoogleAPIWeights[] = ['300', 'regular', '500', '700']

const injectedFonts = new Set<string>()

export async function getExplorerFonts(fonts: ExplorerFonts[]): Promise<ExplorerFonts[]> {
   const now = performance.now()

   const fontFaces: FontFace[] = []

   let fetchIter = 0
   let dbIter = 0

   try {
      for (const font of fonts) {
         for (const allowedWeight of allowedWeights) {
            const fontUrl = font.files[allowedWeight]

            if (!fontUrl) continue

            const weight = allowedWeight === 'regular' ? '400' : allowedWeight

            // 1. Get the weights for the UI
            fonts = fonts.map((currFont) => {
               if (font.family === currFont.family) {
                  currFont.cssWeights.push(weight)
               }
               return currFont
            })

            const familyName = isFirefox ? `"${font.family}"` : font.family

            // 2. Exit if already injected by previous iteration
            const isInjected = injectedFonts.has(familyName)
            if (isInjected) continue

            // 3. Fetch from DB / Google
            const keyName = `${font.family}_${weight}`.replace(/\s/g, '_')

            let buffer: ArrayBuffer | null = await indexedDB.getItem(keyName)

            if (!buffer) {
               const bufferFromGoogle = await fetch(fontUrl).then((res) => res.arrayBuffer())
               buffer = await indexedDB.setItem(keyName, bufferFromGoogle)

               fetchIter++
            } else {
               dbIter++
            }

            // Prepare FontFace
            fontFaces.push(new FontFace(familyName, buffer, { weight, style: 'normal' }))
         }
      }

      await Promise.all(
         fontFaces.map(async (fontFace) => {
            await fontFace.load()
            injectedFonts.add(fontFace.family)
            document.fonts.add(fontFace)
         })
      )
   } catch (err) {
      console.log(err)
      throw new Error('[get-explorer-fonts] - Error fetching fonts.')
   }

   if (import.meta.env.DEV) {
      if (fetchIter) {
         console.log(`Fetching ${fetchIter} fonts took ` + (performance.now() - now) + 'ms')
      }
      if (dbIter) {
         console.log(`Fetching ${dbIter} fonts from DB took ` + (performance.now() - now) + 'ms')
      }
   }

   return fonts
}
