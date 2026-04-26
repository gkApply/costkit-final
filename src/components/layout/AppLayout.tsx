import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { AuthGuard } from './AuthGuard'

export function AppLayout() {
  return (
    <AuthGuard>
      <Navbar />
      <Outlet />
    </AuthGuard>
  )
}
