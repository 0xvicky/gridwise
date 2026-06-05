import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package2,
  FileText,
  Ticket,
  Menu,
  X,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Assets', href: '/assets', icon: Package2 },
  { label: 'Inspections', href: '/inspection/upload', icon: FileText },
  { label: 'Tickets', href: '/tickets', icon: Ticket },
]

export const Header: React.FC = () => (
  <header className="border-b border-dark-600 border-opacity-50 bg-gradient-to-r from-dark-800 to-dark-900 backdrop-blur-sm">
    <div className="flex h-16 items-center justify-between px-6">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan group-hover:shadow-lg group-hover:shadow-accent-cyan/50 transition-all duration-300 flex items-center justify-center">
          <span className="text-white font-bold text-xs">G</span>
        </div>
        <span className="text-lg font-semibold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">GridWise</span>
      </Link>
      <p className="text-sm text-white">Infrastructure Inspection Dashboard</p>
    </div>
  </header>
)

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan p-2 text-white lg:hidden hover:shadow-lg hover:shadow-accent-cyan/50 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-dark-600 border-opacity-50 bg-dark-800 transition-transform lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="space-y-1 p-4 pt-20 lg:pt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href.split('/')[1]))

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lg shadow-accent-cyan/30'
                    : 'text-white hover:text-accent-cyan hover:bg-dark-700'
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-dark-900 lg:flex-row">
    <Sidebar />
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 overflow-auto p-6 lg:ml-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  </div>
)
