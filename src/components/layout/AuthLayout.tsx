import { Outlet } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border p-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
