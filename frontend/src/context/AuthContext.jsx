import { createContext, useContext, useState } from "react";
import { User } from '../models/User'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const nameId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid
      const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role
      return new User(nameId, email, email, role === 'Admin' ? 1 : 0, token)
    } catch {
      return null
    }
  })
  
  const [authReady, setAuthReady] = useState(true)

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
    <AuthContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}