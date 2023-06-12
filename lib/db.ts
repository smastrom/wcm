import indexedDB from 'localforage'
import { randomID, validateName } from './utils'

import {
   DB_NAME,
   DB_STORE_NAME,
   DB_COMBINATION_KEY,
   DEFAULT_HEADLINE_FONT,
   DEFAULT_BODY_FONT
} from './constants'

import type { DBCombination } from '@/types/db'

export const db = { config, init, get, getAll, create, update, remove, getFontBuffer }

function config() {
   indexedDB.config({
      name: DB_NAME,
      storeName: DB_STORE_NAME,
      driver: indexedDB.INDEXEDDB
   })
}

async function init() {
   try {
      await indexedDB.setItem(DB_COMBINATION_KEY, [])
      if (import.meta.env.DEV) {
         console.log('[db-init] - Combinations key created.')
      }
   } catch (error) {
      console.error(error)
      throw new Error('Failed creating DB key.')
   }
}

async function getAll(): Promise<DBCombination[] | null> {
   try {
      const combinations = await indexedDB.getItem<DBCombination[]>(DB_COMBINATION_KEY)
      if (!combinations) {
         console.log('[db-getAll] - Combinations key do not exist.')
         return null
      }
      return combinations.sort((a, b) => b.lastUpdated - a.lastUpdated)
   } catch (error) {
      console.error(error)
      throw new Error(`[db-getAll] - Error getting all combinations.`)
   }
}

async function get(id: string): Promise<DBCombination | null> {
   try {
      const combinations = await getAll()

      if (Array.isArray(combinations)) {
         const item = combinations.find((item) => item.id === id)
         if (import.meta.env.DEV && !item) {
            console.log('[db-get] - Combination not found.')
         }
         return item ?? null
      } else {
         console.warn('[db-get] - Combinations value is not an array.')
         return null
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[db-get] - Error getting combination.`)
   }
}

async function create(name: DBCombination['name']): Promise<DBCombination> {
   try {
      if (!validateName(name)) name = 'New Combination'
      const combinations = await getAll()

      if (Array.isArray(combinations)) {
         const newItem: DBCombination = {
            name,
            headline: DEFAULT_HEADLINE_FONT,
            body: DEFAULT_BODY_FONT,
            id: randomID(),
            lastUpdated: Date.now()
         }
         await indexedDB.setItem(DB_COMBINATION_KEY, [...combinations, newItem])
         return newItem
      } else {
         throw new Error('[db-create] - Combinations value is not an array.')
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[db-create] - Error getting combination.`)
   }
}

export async function update(
   id: string,
   options: Partial<Omit<DBCombination, 'id' | 'lastUpdated'>>
): Promise<DBCombination> {
   try {
      const combinations = await getAll()

      if (Array.isArray(combinations)) {
         const item = combinations.find((item) => item.id === id)
         if (item) {
            console.log('[db-update] - Combination updated.')
            const newItem = { ...item, ...options, lastUpdated: Date.now() }
            await indexedDB.setItem(
               DB_COMBINATION_KEY,
               combinations.map((item) => (item.id === id ? newItem : item))
            )
            return newItem
         } else {
            throw new Error('[db-update] - Combination not found.')
         }
      } else {
         throw new Error('[db-update] - Combinations value is not an array.')
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[db-update] - Error updating combination ${id}}.`)
   }
}

async function remove(id: string): Promise<string | null> {
   try {
      const combinations = await getAll()

      if (Array.isArray(combinations)) {
         await indexedDB.setItem(
            DB_COMBINATION_KEY,
            combinations.filter((item) => item.id !== id)
         )
         return id
      } else {
         throw new Error('[db-delete] - Combinations value is not an array.')
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[db-update] - Error removing combination ${id}}.`)
   }
}

export async function getFontBuffer(key: string, fontUrl: string): Promise<ArrayBuffer> {
   const now = performance.now()

   let fetchIter = 0
   let dbIter = 0

   try {
      let buffer: ArrayBuffer | null = await indexedDB.getItem(key)

      if (!buffer) {
         const bufferFromGoogle = await fetch(fontUrl).then((res) => res.arrayBuffer())
         buffer = await indexedDB.setItem(key, bufferFromGoogle)
         fetchIter++
      } else {
         dbIter++
      }

      if (import.meta.env.DEV) {
         if (fetchIter) {
            console.log(`Fetching ${key} from Google took ` + (performance.now() - now) + 'ms')
         }
         if (dbIter) {
            console.log(`Retrieving ${key} from DB took ` + (performance.now() - now) + 'ms')
         }
      }

      return buffer
   } catch (error) {
      console.error(error)
      throw new Error(`[db-getBuffer] - Error getting font buffer.`)
   }
}
