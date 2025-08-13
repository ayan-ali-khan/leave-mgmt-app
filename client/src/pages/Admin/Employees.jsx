import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import api from '../../utils/api'

export default function Employees() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get('/api/admin/employees').then(res => setRows(res.data||[]))
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load employees'))
      .finally(()=> setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="mb-4 text-2xl font-semibold">Employees</h1>
      {err && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{err}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Join Date</th>
                <th className="p-3">Leaves Remaining</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i} className="border-t">
                  <td className="p-3">{r.fullName || r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.department || '—'}</td>
                  <td className="p-3">{r.joinDate ? new Date(r.joinDate).toDateString() : '—'}</td>
                  <td className="p-3">{r.remainingLeave ?? r.leaveBalance ?? '—'}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan="5" className="p-4 text-center text-sm text-gray-500">No employees.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
