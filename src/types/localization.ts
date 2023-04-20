declare global {
  export interface IAddressSearch {
    fokontanyId?: number
    name?: string
    page: number
    size?: number
  }

  export interface ICreateNewAddress extends IMutationResponse {
    address: IAddress
  }

  export interface IFokontany {
    id: number
    name: string
    boroughId: number
  }

  export interface IBorough {
    id: number
    name: string
    municipalityId: number
  }

  export interface IMunicipality {
    id: number
    name: string
    districtId: number
  }

  export interface IDistrict {
    id: number
    name: string
    regionId: number
  }

  export interface IRegion {
    id: number
    name: string
    provinceId: number
  }

  export interface IProvince {
    id: number
    name: string
  }
}

export {}
