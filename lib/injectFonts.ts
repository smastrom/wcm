import indexedDB from 'localforage'

import { isFirefox } from './utils'

import type { AppFont } from '@/types/store'

export const injectedFonts = new Set<string>()

export async function injectFonts(fonts: AppFont[]): Promise<void> {
   const now = performance.now()

   const fontFaces: { key: string; fontFace: FontFace }[] = []

   let fetchIter = 0
   let dbIter = 0

   try {
      for (const font of fonts) {
         for (const weight in font.files) {
            // 1. Compute the db/instance-set key
            const key = `${font.family}_${weight}`.replace(/\s/g, '_')

            // 2. Exit if already injected by previous iteration
            const isInjected = injectedFonts.has(key)
            if (isInjected) continue

            // 3. Fetch from DB / Google
            const fontUrl = font.files[weight]

            let buffer: ArrayBuffer | null = await indexedDB.getItem(key)

            if (!buffer) {
               const bufferFromGoogle = await fetch(fontUrl).then((res) => res.arrayBuffer())
               buffer = await indexedDB.setItem(key, bufferFromGoogle)

               fetchIter++
            } else {
               dbIter++
            }

            // 4. Prepare FontFace
            const familyName = isFirefox ? `"${font.family}"` : font.family

            fontFaces.push({
               key,
               fontFace: new FontFace(familyName, buffer, { weight, style: 'normal' })
            })
         }
      }

      // 5. Inject fonts
      await Promise.all(
         fontFaces.map(async ({ key, fontFace }) => {
            await fontFace.load()
            injectedFonts.add(key)
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
}
