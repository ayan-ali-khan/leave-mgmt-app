import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import api from '../../utils/api'
import Modal from '../../components/UI/Modal'

export default function Employees() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '', 
    department: '',
    joinDate: ''
  })

  useEffect(() => {

    setLoading(true)
    api.get('/api/admin/employees')
    .then(res => setRows(res.data.employees ||[]))
    .catch(error => setErr(error?.response?.data?.message || 'Failed to load employees'))
    .finally(setLoading(false))
    
  }, [])

  const submit = async () => {
    if (!form.fullName || !form.email || !form.department || !form.joinDate) return setErr('Please fill all fields')
    
    setErr('')
    const payload = { fullName: form.fullName, email: form.email, department: form.department, joinDate: form.joinDate }
    const res = await api.post('/api/admin/add-employee', payload)
    
    // console.log(res.data)
    
    if (res.data.error) return setErr(res.data.error)
    if (res.data.message) setErr(res.data.message)
    
    const response = await api.get('/api/admin/employees');
    setRows(response.data.employees);

    setIsOpen(false);
  }
  
  return (
    <DashboardLayout>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className="mb-4 text-2xl font-semibold">Employees</h1>

        <button onClick={()=>setIsOpen(true)} className="rounded-2xl bg-indigo-600 px-4 py-2 font-semibold text-white">Add Employee</button>
      </div>


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
                  <td className="p-3">{r.totalLeaveBalance ?? r.leaveBalance ?? '—'}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan="5" className="p-4 text-center text-sm text-gray-500">No employees.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
        <h2 className="mb-4 text-lg font-semibold">Add Employee</h2>
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Full Name</label>
          <input type="text" className="rounded-xl border px-3 py-2" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} />
          
          <label className="text-sm">Email</label>
          <input type="email" className="rounded-xl border px-3 py-2" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />

          <label className="text-sm">Department</label>
          <input type="text" className="rounded-xl border px-3 py-2" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
          
          <label className="text-sm">Join Date</label>
          <input type="date" className="rounded-xl border px-3 py-2" value={form.joinDate} onChange={e=>setForm({...form, joinDate:e.target.value})} />

          <div className="mt-2 flex gap-2">
            <button onClick={submit} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">Submit</button>
            <button onClick={()=>setIsOpen(false)} className="rounded-xl border px-4 py-2">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
