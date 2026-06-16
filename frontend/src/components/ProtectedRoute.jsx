import { Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth()

  if (!authReady) return null

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute