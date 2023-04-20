declare global {
  export interface IHelpProgram {
    helpId: number
    name: string
    description?: string
    type?: string
  }

  export interface IHouseholdHelpPayload {
    helpId: number
    bookNumber: string
    observation?: string
    transactionChannel: number
    otherChannel?: string
    bankId?: number
    rib?: string
    paositraMoney?: string
    phoneNumber?: string
    date?: string
  }

  export interface IHouseholdHelpProgram extends IHouseholdHelpPayload {
    helpType: IHelpProgram
  }
}

export {}
