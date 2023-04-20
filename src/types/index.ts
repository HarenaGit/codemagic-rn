declare global {
  interface IOperationOptions<T = any> {
    onSuccess?: (arg?: T) => void
    onError?: () => void
  }

  interface ISnackBarData {
    isVisible: boolean
    message?: string
    variant: "error" | "success"
  }

  interface IMutationResponse {
    success: boolean
    message: string
  }
  interface ILocalization {
    provinceId: number
    regionId: number
    districtId: number
    municipalityId: number
    boroughId: number
    fokontanyId: number
    fokontanyName: string
    siteId: number
  }
  interface FokontanyType {
    fokontany_name: string
    borough_name: string
    borough_id: number
    region_id: number
    province_name: string
    fokontany_id: number
    district_name: string
    province_id: number
    region_name: string
    district_id: number
    common_name: string
    common_id: number
    badge_link: string
  }
  export interface CitizenItemType {
    book_number?: string
    borough_name?: string
    current_address?: string
    f_name?: string
    name?: string
    birth_date?: string
    job_id?: string | number
    job?: string
    job_other?: string
    nationality_id?: string | number
    sexe?: string | number
    birth_place?: string
    phone?: string
    cin_citizen?: string
    cin_deliverance_date?: string
    cin_deliverance_place?: string
    handicapped?: string
    marital_status?: string
    father?: string
    mother?: string
    father_status?: number
    mother_status?: number
    household_chief?: string
    id_citizen?: string | number
    photo?: string

    error?: number
    msg?: string
  }

  export interface AppUser {
    failed?: boolean
    msg?: boolean
    user_id?: string
    first_name?: string
    last_name?: string
    email?: string
    fokontany_id?: number
    user_fokontany?: FokontanyType
  }

  export interface MigrationItemType {
    reason: string
    fokontany_target_id: number
    household_id: number
    request_date: string
    book_number: string
    fokontany_source_id: number
    type: number
    status: number
    total_queries: number
    fokontany: string
    error?: boolean
    msg?: string
  }

  export interface MigrationHouseholdType {
    error?: boolean
    msg?: string
    fokontany: FokontanyType
    current_address: string
    citizens: {
      cin_citizen: string
      reason: string
      fokontany_target_id: string
      birth_date: string
      address_id: any
      type: string
      citizen_id: string
      migration_id: string
      photo: string
      household_id: string
      request_date: string
      name: string
      f_name: string
      fokontany_source_id: string
      validation_date: any
      status: string
    }[]
  }
}

export {}
