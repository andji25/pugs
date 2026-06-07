import { createContext, useContext, useState } from "react";
import { User } from '../models/User'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    const user = new User(
      userData.id,
      userData.name,
      userData.email,
      userData.role,
      userData.token
    )
    setUser(user)
    localStorage.setItem('token', userData.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}