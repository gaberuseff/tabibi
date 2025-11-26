import { createContext, useContext } from "react"
import useUser from "./useUser"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: user, isLoading } = useUser()

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
