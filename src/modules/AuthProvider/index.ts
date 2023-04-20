import { useContext } from "react"
import AuthContext from "./AuthContext"
import AuthProvider from "./AuthProvider"

export const useAuthContext = () => useContext(AuthContext)
export default AuthProvider
