export type DBVariantTarget = 'headline' | 'body'

export interface DBFontFamilyData {
   family: string
   weight: string
}

export type DBFontTarget = Record<DBVariantTarget, DBFontFamilyData>

export type DBCombination = {
   id: string
   lastUpdated: number
   name: string
} & DBFontTarget
