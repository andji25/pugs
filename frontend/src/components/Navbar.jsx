import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/login' || location.pathname === '/register')
    return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/40 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-sky-200 shadow-sm">
      <span
        onClick={() => navigate('/trips')}
        className="text-xl font-bold text-teal-700 cursor-pointer hover:text-teal-900 transition">
        🌍 Travel Planner
      </span>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-teal-700">Hello, {user.name}</span>
            {user.isAdmin() && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm transition">
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm transition">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar