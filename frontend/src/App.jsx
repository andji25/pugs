import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import TripFormPage from './pages/TripFormPage'
import Navbar from './components/Navbar'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <TripsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/trips" element={
                        <ProtectedRoute>
                            <TripsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/trips/:id" element={
                        <ProtectedRoute>
                            <TripDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/trips/new" element={
                        <ProtectedRoute>
                            <TripFormPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/trips/:id/edit" element={
                        <ProtectedRoute>
                            <TripFormPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App