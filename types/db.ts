export interface DBCombinationInternal {
   id: string
   lastUpdated: number
}

export interface DBCombinationShared {
   name: string
   previewText: string
   headline: {
      family: string
      weight: string
   }
   body: {
      family: string
      weight: string
   }
}

export interface DBCombination extends DBCombinationInternal, DBCombinationShared {}
