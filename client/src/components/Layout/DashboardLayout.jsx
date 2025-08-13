import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
