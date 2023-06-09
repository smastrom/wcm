import type { AppFontWeights } from './store'

export type DBVariantTarget = 'headline' | 'body'

export interface DBFontFamilyData {
   family: string
   weight: AppFontWeights
}

export type DBFontTarget = Record<DBVariantTarget, DBFontFamilyData>

export type DBCombination = {
   id: string
   lastUpdated: number
   name: string
} & DBFontTarget
