import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email address, missing `@`'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const data = await authService.login(email, password)
      login(data)
      navigate('/trips')
    } catch (err) {
      setErrors({ general: 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">

        <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">
          🌍 Travel Planner
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.email ? 'border-red-400' : 'border-sky-200'}`}
          />
          {errors.email && <p className="text-red-500 text-sm -mt-2">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.password ? 'border-red-400' : 'border-sky-200'}`}
          />
          {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password}</p>}

          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-teal-700">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold hover:underline hover:text-teal-900">Register</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage