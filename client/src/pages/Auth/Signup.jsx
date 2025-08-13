import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const role = params.get('role') || 'employee'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [joinDate, setJoinDate] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    try {
      setLoading(true);
      const data = await signup(fullName, email, password, department, joinDate, role)
      
        setLoading(false)
      if(data?.token){
        setOk('Signup successful! Redirecting to login...')
        nav(`/login?role=${role}`)
      }
      else{
        toast.error(data?.message || "Something went wrong");
      }
    } catch (e) {
      setLoading(false)
      toast.error(e?.response?.data?.message || "Something went wrong");
      setErr(e?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-1 text-2xl font-semibold">Signup ({role})</h2>
        <p className="mb-6 text-sm text-gray-500">Create your account.</p>

        {err && <div className="mb-4 rounded-lg bg-red-100 p-2 text-sm text-red-700">{err}</div>}
        {ok && <div className="mb-4 rounded-lg bg-green-100 p-2 text-sm text-green-700">{ok}</div>}

        <label className="mb-2 block text-sm font-medium">Full name</label>
        <input
          className="mb-4 w-full rounded-xl border px-3 py-2"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />

        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="mb-4 w-full rounded-xl border px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="mb-4 w-full rounded-xl border px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={5}
        />

        <label className="mb-2 block text-sm font-medium">Department</label>
        <input
          className="mb-4 w-full rounded-xl border px-3 py-2"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          required
        />

        <label className="mb-2 block text-sm font-medium">Join Date</label>
        <input
          type="date"
          className="mb-6 w-full rounded-xl border px-3 py-2"
          value={joinDate}
          onChange={e => setJoinDate(e.target.value)}
          required
        />

        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{loading?'Signing in...':'Sign In'}</button>

        <p className="mt-4 text-center text-sm">
          Have an account?{' '}
          <Link to={`/login?role=${role}`} className="text-indigo-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}