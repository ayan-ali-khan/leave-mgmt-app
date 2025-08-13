import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import api from '../../utils/api'

export default function LeaveRequests() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get('/api/admin/leaves')
      .then(res => setRows(res.data || []))
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load requests'))
      .finally(()=> setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/api/admin/leaves/${id}`, { status })
      setRows(prev => prev.map(r => (r._id === id ? res.data : r)))
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="mb-4 text-2xl font-semibold">Leave Requests</h1>
      {err && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{err}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Email</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i} className="border-t">
                  <td className="p-3">{r.employeeName || r.employee?.fullName || '—'}</td>
                  <td className="p-3">{r.employeeEmail || r.employee?.email || '—'}</td>
                  <td className="p-3">{new Date(r.startDate).toDateString()}</td>
                  <td className="p-3">{new Date(r.endDate).toDateString()}</td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={()=>updateStatus(r._id, 'approved')} className="rounded bg-green-600 px-3 py-1 text-white">Approve</button>
                      <button onClick={()=>updateStatus(r._id, 'rejected')} className="rounded bg-red-600 px-3 py-1 text-white">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan="7" className="p-4 text-center text-sm text-gray-500">No requests.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
