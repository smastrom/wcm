import indexedDB from 'localforage'
import { DB_NAME, DB_STORE_NAME, DB_COMBINATION_KEY } from './constants'

import type { DBCombination } from '@/types/db'

export const db = { config, init, get, getAll, create, update, remove }

// TODO: Streamline conditions once dev is done

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
      }
      return combinations
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
         throw new Error('[db-get] - Combinations value is not an array.')
      }
   } catch (error) {
      console.error(error)
      throw new Error(`[db-get] - Error getting combination.`)
   }
}

async function create(
   options: Omit<DBCombination, 'id' | 'lastUpdated'>
): Promise<DBCombination> {
   try {
      const combinations = await getAll()

      if (Array.isArray(combinations)) {
         const newItem = { ...options, id: crypto.randomUUID(), lastUpdated: Date.now() }
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
