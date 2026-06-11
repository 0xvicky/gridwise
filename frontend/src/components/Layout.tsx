import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package2,
  FileText,
  Ticket,
  Menu,
  Search,
  Bell,
  X,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { ParticleBackground } from './three/ParticleBackground'
import { PageTransition } from './ui/PageTransition'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Assets', href: '/assets', icon: Package2 },
  { label: 'Inspections', href: '/inspection/upload', icon: FileText },
  { label: 'Tickets', href: '/tickets', icon: Ticket },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background shadow-card-hover lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} className="text-text-primary" /> : <Menu size={20} className="text-text-primary" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-text-primary/10 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-background transition-transform duration-300 ease-premium lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold tracking-tight text-text-primary">
            GridWise
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                  active
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-text-secondary">Infrastructure Intelligence</p>
          <p className="mt-0.5 text-xs font-medium text-primary">v0.1.0</p>
        </div>
      </aside>
    </>
  )
}

export const TopNav: React.FC = () => (
  <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-8">
    <div className="relative hidden max-w-md flex-1 sm:block">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <input
        type="search"
        placeholder="Search assets, inspections, tickets..."
        className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus-ring focus:border-primary/30"
      />
    </div>

    <div className="flex items-center gap-3 sm:ml-auto">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary-dark">
        GW
      </div>
    </div>
  </header>
)

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="relative min-h-screen bg-background">
    <ParticleBackground />
    <div className="relative z-10 flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <TopNav />
        <main className="flex-1 overflow-auto px-6 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  </div>
)
