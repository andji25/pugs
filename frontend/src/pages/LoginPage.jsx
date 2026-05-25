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
        if(!email.includes('@')) newErrors.email = 'Invalid email address'
        if(password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if(Object.keys(validationErrors).length > 0){
            setErrors(validationErrors)
            return
        }

        setErrors({})
        setLoading(true)

        try {
          const data = await authService.login(email, password)
          login(data)
          navigate('/trips')
        } catch(err) {
            setErrors({ general: 'Invalid email or password'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      )
}

export default LoginPage