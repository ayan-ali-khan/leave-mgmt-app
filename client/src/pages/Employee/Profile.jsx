import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/api/me')
      .then(res => {
        if (!mounted) return
        setProfile(res.data)
        // merge leave balance if provided by backend
        if (user && res.data?.leaveBalance !== undefined) {
          const merged = { ...user, leaveBalance: res.data.leaveBalance }
          setUser(merged); localStorage.setItem('user', JSON.stringify(merged))
        }
      })
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load profile'))
      .finally(()=> setLoading(false))
    return ()=>{ mounted = false }
  }, [])

  return (
    <DashboardLayout>
      <h1 className="mb-4 text-2xl font-semibold">My Profile</h1>
      {loading && <div>Loading...</div>}
      {err && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{err}</div>}
      {profile && (
        <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-2 font-semibold">Basic Info</h2>
            <p><span className="text-gray-500">Name:</span> {profile.fullName || profile.name}</p>
            <p><span className="text-gray-500">Email:</span> {profile.email}</p>
            <p><span className="text-gray-500">Department:</span> {profile.department || '—'}</p>
            <p><span className="text-gray-500">Joined:</span> {profile.joinDate ? new Date(profile.joinDate).toDateString() : '—'}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-2 font-semibold">Leave</h2>
            <p><span className="text-gray-500">Total Balance:</span> {profile.totalLeaveBalance ?? profile.leaveBalance ?? '—'}</p>
            <p><span className="text-gray-500">Used:</span> {profile.usedLeave ?? '—'}</p>
            <p><span className="text-gray-500">Remaining:</span> {profile.remainingLeave ?? (profile.totalLeaveBalance !== undefined && profile.usedLeave !== undefined ? profile.totalLeaveBalance - profile.usedLeave : '—')}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
