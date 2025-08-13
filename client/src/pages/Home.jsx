import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 p-6 text-white">
      <h1 className="mb-2 text-4xl font-bold">Leave Management System</h1>
      <p className="mb-8 opacity-90">Fast, simple leave tracking for your team.</p>
      <div className="flex gap-4">
        <Link to="/login?role=employee" className="rounded-2xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg hover:opacity-90">
          Employee Login / Signup
        </Link>
        <Link to="/login?role=admin" className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg hover:opacity-90">
          Admin Login / Signup
        </Link>
      </div>
    </div>
  )
}
