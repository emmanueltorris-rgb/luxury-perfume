import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requireAdmin = false, redirectTo = '/' }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
