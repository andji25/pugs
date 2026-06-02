import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav>
            <span onClick={() => navigate('/trips')} style={{ cursor: 'pointer'}}>Travel Planner</span>
            <div>
                {user && (
                    <>
                        <span>Hello, {user.name}</span>
                        {user.isAdmin() && (
                            <button onClick={() => navigate('/admin')}>Admin Panel</button>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar