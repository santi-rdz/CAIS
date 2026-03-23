import { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout grid h-dvh">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Header onMenuOpen={() => setMenuOpen(true)} menuOpen={menuOpen} />

      <main className="overflow-scroll bg-gray-50 py-6 [grid-area:main] lg:py-10">
        <div className="my-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
