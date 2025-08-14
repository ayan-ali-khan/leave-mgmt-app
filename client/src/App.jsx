import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Profile from './pages/Employee/Profile'
import Leaves from './pages/Employee/Leaves'
import LeaveRequests from './pages/Admin/LeaveRequests'
import Employees from './pages/Admin/Employees'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to={`/login?role=${role||'employee'}`} state={{ from: loc }} replace />
  if (role && user.role !== role) return <Navigate to={user.role==='admin'?'/admin/leave-requests':'/employee/leaves'} replace />
  return children
}

export default function App() {
  const { user } = useAuth()
  return (
    <div>
    <Toaster/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/employee/profile" element={user ? <RequireAuth role="employee"><Profile /></RequireAuth>: <Navigate to="/login"/>} />
      <Route  path="/employee/leaves" element={user ? <RequireAuth role="employee"><Leaves /></RequireAuth>: <Navigate to="/login"/>} />

      <Route path="/admin/leave-requests" element={user ? <RequireAuth role="admin"><LeaveRequests /></RequireAuth>: <Navigate to="/login?role=admin"/>} />
      <Route path="/admin/employees" element={user ? <RequireAuth role="admin"><Employees /></RequireAuth>: <Navigate to="/login?role=admin"/>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </div>
  )
}
