declare global {
  export interface ILoginPayload {
    username: string
    password: string
  }
  export interface ILoginResponse {
    access_token: string
  }
  export interface IGroup {
    id: number
    name: string
  }

  export interface IUserInfo {
    id: number
    userName: string
    email: string
    lastName: string
    firstName: string
    phoneNumber: string
    sex: number
    active: number
    groups: IGroup[]
    fokontany: IFokontany[]
    boroughs: IBorough[]
  }
}

export {}
