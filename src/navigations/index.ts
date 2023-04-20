const ROUTES = {
  Login: "Login",
  SelectFokotany: "SelectFokotany",
  Home: "Home",
  QrScanner: "QrScanner",
  HouseholdCitizens: "HouseholdCitizens",
  CitizenEditor: "CitizenEditor",
  CitizenView: "CitizenView",
  Migrations: "Migrations",
  About: "About",
  MigrationDetail: "MigrationDetail",
  SearchForm: "SearchForm",
  SearchResult: "SearchResult",
  AddressList: "AddressList",
  HouseHoldHelps: "HouseHoldHelps",
  AllocateHelp: "AllocateHelp",
  EnrollDisaster: "EnrollDisaster",
}

export type NavigationParamList = {
  Login: {}
  SelectFokotany: { intent: "init" | "update" }
  Home: {}
  QrScanner: {}
  HouseholdCitizens: { bookNumber: string; origin: "search" | "qrcode" }
  MigrationDetail: {
    household_id: number
    fokontany_target_id: number
    fokontany_source_id: number
    request_date: string
  }
  CitizenEditor: {
    citizen: Partial<ICitizen>
    intent: "createhousehold" | "updatecitizen" | "addhouseholdmember"
    validation: boolean
  }
  CitizenView: { citizenId: number; lastName: string; firstName: string }
  Migrations: {}
  About: {}
  SearchForm: undefined
  SearchResult: undefined
  AddressList: undefined
  HouseHoldHelps: { bookNumber: string }
  AllocateHelp: { bookNumber: string }
  EnrollDisaster: { householdId: number }
}

export default ROUTES
