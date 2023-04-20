declare global {
  export interface ISearchCitizen {
    fokontanyId?: number
    lastName?: string
    firstName?: string
    cni?: number
    birthDate?: string
    page: number
    size: number
  }

  export interface IHousehold {
    householdId: number
    bookNumber: string
    registerNumber?: string
    citizens?: ICitizen[]
    address?: IAddress
  }

  export interface IAddress {
    addressId: number
    fokontanyId: number
    name: string
    sector?: string

    fokontany?: IFokontany
    borough?: IBorough
    municipality?: IMunicipality
    district?: IDistrict
    region?: IRegion
    province?: IProvince
  }

  export interface ICitizen {
    id: number
    CNI?: string
    CNIDeliveryPlace?: string
    CNIDeliveryDate?: string
    lastName: string
    firstName: string
    birthDate?: string
    birthPlace?: string
    gender?: number
    phoneNumber?: string
    nationalityId?: number
    isDisabled?: boolean
    isDied?: boolean
    deathDate?: string
    isHandicapped?: boolean
    father?: string
    mother?: string
    fatherStatus?: number
    motherStatus?: number
    jobId?: number
    jobStatus?: string
    jobOther?: string
    passport?: string
    passportDeliveryDate?: string
    passportDeliveryPlace?: string
    photo?: string
    isChief?: boolean
    isConfirmed?: boolean

    household?: IHousehold

    address?: IAddress
  }

  export interface ICreateCitizen extends IMutationResponse {
    citizen: ICitizen
  }

  export class IMarkValidChiefDto {
    addressId: number
    householdId: number
    status: number
  }
}

export {}
