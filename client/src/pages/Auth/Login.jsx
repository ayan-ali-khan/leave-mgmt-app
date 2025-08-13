import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const roleHint = params.get('role') || 'employee'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('');
    try {
      setLoading(true)
      const user = await login(email, password, roleHint)
      if (user.role === 'admin') nav('/admin/leave-requests')
      else nav('/employee/leaves')
    } catch (e) {
      setErr(e?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ document.title = `Login (${roleHint})` }, [roleHint])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-1 text-2xl font-semibold">Login ({roleHint})</h2>
        <p className="mb-6 text-sm text-gray-500">Use your registered email & password.</p>
        {err && <div className="mb-4 rounded-lg bg-red-100 p-2 text-sm text-red-700">{err}</div>}
        <label className="mb-2 block text-sm font-medium">Email</label>
        <input type="email" className="mb-4 w-full rounded-xl border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="mb-2 block text-sm font-medium">Password</label>
        <input type="password" className="mb-6 w-full rounded-xl border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{loading?'Logging in...':'Login'}</button>
        <p className="mt-4 text-center text-sm">
          No account? <Link to={`/signup?role=${roleHint}`} className="text-indigo-600 underline">Signup</Link>
        </p>
      </form>
    </div>
  )
}
