import { Outlet } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
