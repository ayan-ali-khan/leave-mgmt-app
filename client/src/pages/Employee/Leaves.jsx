import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import Modal from '../../components/UI/Modal'
import api from '../../utils/api'
// import { useAuth } from '../../context/AuthContext';

// const { user } = useAuth();

function daysBetweenInclusive(start, end) {
  const s = new Date(start); const e = new Date(end)
  const diff = Math.ceil((e - s) / (1000*60*60*24)) + 1
  return diff
}

export default function Leaves() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' })
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ remaining: null })
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const requestedDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0
    try { return daysBetweenInclusive(form.startDate, form.endDate) } catch { return 0 }
  }, [form.startDate, form.endDate])

  const overLimit = requestedDays > 20

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      api.get('/api/employee/leaves'),
      api.get('/api/employee/check-balance')
    ]).then(([leavesRes, meRes]) => {
      if (!mounted) return
      setRows(leavesRes.data.leaves)

      const remaining = meRes?.data?.remaining ?? 0; 
      setStats({ remaining })
    }).catch(e => setErr(e?.response?.data?.message || 'Failed to load'))
      .finally(()=> setLoading(false))
    return ()=>{ mounted=false }
  }, [])

  const submit = async () => {
    if (!form.startDate || !form.endDate || !form.reason) return setErr('Please fill all fields')
    if (overLimit) return setErr('Cannot apply for more than 20 days.')
    if (stats.remaining !== null && requestedDays > stats.remaining) {
      return setErr(`You only have ${stats.remaining} day(s) remaining.`)
    }
    setErr('')
    const payload = { startDate: form.startDate, endDate: form.endDate, reason: form.reason }
    const res = await api.post('/api/employee/apply-leave', payload)
    
    // console.log(res.data)
    
    if (res.data.error) return setErr(res.data.error)
    if (res.data.message) setErr(res.data.message)
    
    const leavesRes = await api.get('/api/employee/leaves');
    setRows(leavesRes.data.leaves);

    setIsOpen(false);
  }

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Leaves</h1>
        <button onClick={()=>setIsOpen(true)} className="rounded-2xl bg-indigo-600 px-4 py-2 font-semibold text-white">Apply for Leave</button>
      </div>

      {err && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{err}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-gray-600">Remaining balance: <span className="font-semibold">{stats.remaining ?? '—'}</span></p>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="min-w-[720px] w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length !==0 ? (rows.map((leave, idx) => {
                  const days = daysBetweenInclusive(leave.startDate, leave.endDate)
                  return (
                    <tr key={leave._id || idx} className="border-t">
                      <td className="p-3">{new Date(leave.startDate).toDateString()}</td>
                      <td className="p-3">{new Date(leave.endDate).toDateString()}</td>
                      <td className="p-3">{days}</td>
                      <td className="p-3">{leave.reason}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${leave.status==='approved'?'bg-green-100 text-green-700': leave.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>
                          {leave.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  )
                })) : (
                  <tr><td className="p-4 text-center text-sm text-gray-500" colSpan="5">No leaves yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
        <h2 className="mb-4 text-lg font-semibold">Apply for Leave</h2>
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Start date</label>
          <input type="date" className="rounded-xl border px-3 py-2" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} />
          <label className="text-sm">End date</label>
          <input type="date" className="rounded-xl border px-3 py-2" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} />
          <label className="text-sm">Reason</label>
          <textarea className="rounded-xl border px-3 py-2" rows="3" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} placeholder="Optional short reason" />
          <div className="text-sm text-gray-600">Requested days: <b>{requestedDays || 0}</b> (max 20)</div>
          <div className="mt-2 flex gap-2">
            <button onClick={submit} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">Submit</button>
            <button onClick={()=>setIsOpen(false)} className="rounded-xl border px-4 py-2">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
