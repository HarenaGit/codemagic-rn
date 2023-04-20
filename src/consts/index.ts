import { releaseName } from "../../app.json"

export const NAVIGATION_PERSISTENCE_KEY = `NAVIGATION_STATE_${releaseName}`
export const ACCESS_TOKEN_KEY = `ACCESS_TOKEN_${releaseName}`
export * from "./nationalities"
export * from "./jobs"

export const HELP_TYPE_CASH = "2"

export const REQUEST_MAX_RETRY = 3
