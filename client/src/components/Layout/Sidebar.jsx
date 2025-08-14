import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NavLink = ({ to, children }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to} className={`block rounded-xl px-4 py-2 ${active ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}>
      {children}
    </Link>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  return (
    <aside className="h-screen w-64 shrink-0 border-r bg-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Leave Management App</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <nav className="space-y-2">
        {!isAdmin && (
          <>
            <NavLink to="/employee/profile">Profile</NavLink>
            <NavLink to="/employee/leaves">My Leaves</NavLink>
          </>
        )}
        {isAdmin && (
          <>
            <NavLink to="/admin/leave-requests">Leave Requests</NavLink>
            <NavLink to="/admin/employees">Employees</NavLink>
          </>
        )}
        <button onClick={logout} className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2 text-white">Logout</button>
      </nav>
    </aside>
  )
}
