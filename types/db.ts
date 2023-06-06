export interface DBFontFamilyData {
   family: string
   weight: string
}

export interface DBCombination {
   id: string
   lastUpdated: number
   name: string
   headline: DBFontFamilyData
   body: DBFontFamilyData
   family: string
   weight: string
}
