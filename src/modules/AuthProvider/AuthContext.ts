import { createContext } from "react"

type ContextType = {
  currentUser?: IUserInfo | null
  setAccessToken: (access_token?: string) => Promise<void>
  setCurrentUser: (newUser?: IUserInfo | null) => void
}

export const AuthContext = createContext<ContextType>({
  currentUser: null,
  setAccessToken: async (access_token?: string) => {},
  setCurrentUser: (newUser?: IUserInfo | null) => {},
})

export default AuthContext
