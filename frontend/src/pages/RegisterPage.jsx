import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from '../services/authService'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email address, missing `@`'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await authService.register(name, email, password)
      navigate('/login?registered=true')
    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' })
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
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.name ? 'border-red-400' : 'border-sky-200'}`}
          />
          {errors.name && <p className="text-red-500 text-sm -mt-2">{errors.name}</p>}

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.confirmPassword ? 'border-red-400' : 'border-sky-200'}`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm -mt-2">{errors.confirmPassword}</p>}

          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-teal-700">
          Already have an account?{' '}
          <a href="/login" className="font-semibold hover:underline hover:text-teal-900">Login</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage