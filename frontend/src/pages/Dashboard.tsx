import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Package2, FileSearch, Ticket, AlertTriangle, ArrowRight, Activity } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  AnimatedCounter,
  Badge,
  Timeline,
} from '@/components'
import { TowerWireframe } from '@/components/three/TowerWireframe'
import { useAssets } from '@/hooks/useAssets'
import { useTickets } from '@/hooks/useTickets'
import { useInspections } from '@/hooks/useInspection'
import { AnalysisStatus, TicketStatus } from '@/types/enums'
import { priorityStyles, ticketStatusStyles, formatLabel } from '@/lib/badges'

const Dashboard: React.FC = () => {
  const { data: assets } = useAssets()
  const { data: tickets } = useTickets()
  const { data: inspections } = useInspections()

  const totalAssets = assets?.length ?? 0
  const openTickets = tickets?.filter((t) => t.status === TicketStatus.OPEN).length ?? 0
  const criticalDefects = tickets?.filter((t) => t.priority === 'P1').length ?? 0
  const totalInspections = inspections?.length ?? 0

  const stats = [
    {
      label: 'Total Assets',
      value: totalAssets,
      icon: Package2,
      href: '/assets',
    },
    {
      label: 'Total Inspections',
      value: totalInspections,
      icon: FileSearch,
      href: '/inspection/upload',
    },
    {
      label: 'Open Tickets',
      value: openTickets,
      icon: Ticket,
      href: '/tickets',
    },
    {
      label: 'Critical Defects',
      value: criticalDefects,
      icon: AlertTriangle,
      href: '/tickets',
    },
  ]

  // const recentInspections = [
  //   { id: '1', asset: 'Tower A-01', status: 'Completed', score: 85, date: '2024-06-05' },
  //   { id: '2', asset: 'Pole B-15', status: 'Processing', score: null, date: '2024-06-04' },
  //   { id: '3', asset: 'Rail C-07', status: 'Completed', score: 72, date: '2024-06-03' },
  // ]
  const recentInspections = inspections?.slice(0, 3)?.map((ins) => {
    return {
      id: ins.inspection_id,
      asset: ins.asset_name,
      status: ins.analysis_status,
      score: ins.health_score,
      date: format(new Date(ins.capture_date), 'yyyy-MM-dd'),
    }
  })

  const recentTickets = tickets?.slice(0, 3) ?? []

  const healthScores = [
    { zone: 'North Region', score: 87, assets: 8 },
    { zone: 'Central Grid', score: 72, assets: 12 },
    { zone: 'South Corridor', score: 91, assets: 6 },
    { zone: 'East Distribution', score: 65, assets: 9 },
  ]

  const activityEvents = [
    {
      id: '1',
      title: 'AI analysis completed',
      description: 'Inspection #a3f2b1 — 3 defects detected on Tower A-01',
      time: '12 min ago',
      type: 'success' as const,
    },
    {
      id: '2',
      title: 'Ticket P1 created',
      description: 'Corrosion detected — assigned to Maintenance Team Alpha',
      time: '45 min ago',
      type: 'critical' as const,
    },
    {
      id: '3',
      title: 'Drone inspection uploaded',
      description: 'Pole B-15 — 24 images queued for validation',
      time: '2 hours ago',
      type: 'info' as const,
    },
    {
      id: '4',
      title: 'Health score updated',
      description: 'Central Grid zone score decreased from 78 to 72',
      time: '5 hours ago',
      type: 'warning' as const,
    },
  ]

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-card border border-border bg-surface p-8 shadow-card lg:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(243,141,38,0.13),transparent_30%),radial-gradient(circle_at_84%_34%,rgba(21,89,89,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(232,241,241,0.62)_100%)]" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-accent">Operations Dashboard</p>
            <h1 className="mt-2 text-[2.75rem] font-extrabold leading-tight text-primary lg:text-[3.25rem]">
              GridWise AI Infrastructure Intelligence
            </h1>
            <p className="mt-4 max-w-lg text-base font-medium text-accent-dark">
              Real-time monitoring of critical infrastructure assets, drone inspections, and
              AI-powered defect detection.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Link key={stat.label} to={stat.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                      className="group rounded-xl border border-border bg-white/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface hover:shadow-card-hover"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light transition-colors group-hover:bg-accent-light">
                        <Icon size={16} className="text-primary group-hover:text-accent" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-primary">
                        <AnimatedCounter value={stat.value} />
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        {stat.label}
                      </p>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden lg:block">
            <TowerWireframe height={280} />
          </div>
        </div>
      </motion.section>

      {/* Health Score Overview */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-section-title text-primary">Health Score Overview</h2>
          <Link
            to="/assets"
            className="flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {healthScores.map((item, idx) => (
            <motion.div
              key={item.zone}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.06, duration: 0.4 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent-dark">{item.zone}</p>
                    <p className="mt-2 text-3xl font-semibold text-primary">
                      <AnimatedCounter value={item.score} suffix="%" />
                    </p>
                    <p className="mt-1 text-xs font-medium text-accent">
                      {item.assets} assets monitored
                    </p>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.score >= 80
                        ? 'bg-success'
                        : item.score >= 60
                          ? 'bg-warning'
                          : 'bg-critical'
                    }`}
                  />
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    className={`h-full rounded-full ${
                      item.score >= 80
                        ? 'bg-success'
                        : item.score >= 60
                          ? 'bg-warning'
                          : 'bg-critical'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Inspections & Tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Inspections</CardTitle>
              <Link
                to="/inspection/upload"
                className="text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
              >
                Upload
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentInspections?.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-primary-light/45"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary">{inspection.asset}</p>
                      <p className="text-xs font-medium text-accent">{inspection.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          inspection.status === AnalysisStatus.COMPLETED ? 'success' : 'warning'
                        }
                      >
                        {inspection.status}
                      </Badge>
                      {inspection.score !== null && (
                          <p className="mt-1 text-xs font-medium text-accent">
                            Score: {inspection.score}%
                          </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <Link
                to="/tickets"
                className="text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recentTickets.length === 0 ? (
                <p className="py-6 text-center text-sm text-text-secondary">No tickets yet</p>
              ) : (
                <div className="space-y-1">
                  {recentTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/ticket/${ticket.id}`}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-primary-light/45"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-semibold ${priorityStyles[ticket.priority]}`}
                          >
                            {ticket.priority}
                          </span>
                          <p className="truncate text-sm font-medium text-text-primary">
                            {ticket.title}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-accent">
                          Due: {format(new Date(ticket.due_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`ml-3 shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${ticketStatusStyles[ticket.status]}`}
                      >
                        {formatLabel(ticket.status)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Activity Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <CardTitle>System Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Timeline events={activityEvents} />
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}

export default Dashboard
