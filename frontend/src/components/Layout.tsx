import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package2,
  FileText,
  Ticket,
  Menu,
  Search,
  TrendingUpDownIcon,
  Bell,
  X,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { ParticleBackground } from './three/ParticleBackground'
import { PageTransition } from './ui/PageTransition'
import inspiredByLogo from '../../assets/logo.png'

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
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface shadow-card-hover lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={20} className="text-text-primary" />
        ) : (
          <Menu size={20} className="text-text-primary" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-text-primary/10 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-premium lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="border-b border-border px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-extrabold text-primary">GridWise</span>
              <p className="mt-0.5 max-w-[11rem] text-[11px] leading-4 text-text-secondary">
                Powered by AI Infrastructure Intelligence
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-background/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Inspired By
            </p>
            <img
              src={inspiredByLogo}
              alt="Inspired by ENRZY"
              className="mt-2 h-7 max-w-full object-contain object-left"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200',
                  active
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-text-secondary hover:bg-background hover:text-primary'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
                )}
                <Icon size={18} strokeWidth={active ? 2.25 : 2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-text-secondary">Infrastructure Intelligence</p>
          <p className="mt-0.5 text-xs font-semibold text-primary">v0.1.0</p>
        </div>
      </aside>
    </>
  )
}

export const TopNav: React.FC = () => (
  <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-md lg:px-8">
    <div className="relative hidden max-w-md flex-1 sm:block">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
      <input
        type="search"
        placeholder="Search assets, inspections, tickets..."
        className="field-control h-10 w-full pl-9 pr-4 text-sm"
      />
    </div>

    <div className="flex items-center gap-3 sm:ml-auto">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm">
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
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <TopNav />
        <main className="flex-1 overflow-auto px-5 py-10 sm:px-6 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  </div>
)
