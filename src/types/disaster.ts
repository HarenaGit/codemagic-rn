declare global {
  export interface IHouseholdDisasterPayload {
    siteId: number
    householdId: number
    quantity: number
    quantityMale: number
    quantityFemale: number
    quantityStudent: number
    childrenUnder5Year: number
    quantityPregnant: number
    quantityFemaleFeeding: number
    quantityHandicapped: number
    quantityOver60Year: number
    quantityDiarrhea: number
    quantityProblemRespiratory: number
    quantityGetFlu: number
    quantityGetPaludism: number
    destroyedSchoolKit: boolean
    destroyedKitchenEquipment: boolean
    destroyedWaterSource: boolean
    destroyedWaterStore: boolean
    destroyedHouse: boolean
    burningHouse: boolean
    floodedHouse: boolean
    rooflessHouse: boolean
    hasElectricity: boolean
    hasDrinkingWater: boolean
    observation?: string
    scanQr: boolean
    entryDate: string
    simpleBook: boolean
    noBook: boolean
  }

  export interface IEvacuationSitePayload {
    siteId: number
    regionId: number
    name: string
  }
}

export {}
