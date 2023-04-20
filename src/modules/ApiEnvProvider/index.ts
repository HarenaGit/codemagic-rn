import { useContext } from "react"
import ApiEnvContext from "./ApiEnvContext"
import ApiEnvProvider from "./ApiEnvProvider"

export const useApiEnvContext = () => useContext(ApiEnvContext)
export default ApiEnvProvider
