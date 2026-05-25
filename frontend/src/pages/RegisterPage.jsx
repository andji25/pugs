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
        if(name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
        if(!email.includes('@')) newErrors.email = 'Invalid email address'
        if(password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if(password != confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
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
          await authService.register(name, email, password)
          navigate('/login')
        } catch(err) {
            setErrors({ general: 'Registration failed. Please try again.'})
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
            </div>
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
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
            </div>
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      )
}

export default RegisterPage