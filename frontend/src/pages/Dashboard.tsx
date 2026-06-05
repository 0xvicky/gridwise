import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components'
import { LoadingSpinner, EmptyState } from '@/components/Loading'

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Assets',
      value: '24',
      icon: TrendingUp,
      gradient: 'from-accent-blue to-accent-cyan',
    },
    {
      label: 'Inspections',
      value: '156',
      icon: CheckCircle,
      gradient: 'from-accent-green to-accent-cyan',
    },
    {
      label: 'Open Tickets',
      value: '12',
      icon: Clock,
      gradient: 'from-accent-amber to-accent-blue',
    },
    {
      label: 'Critical Defects',
      value: '3',
      icon: AlertCircle,
      gradient: 'from-red-500 to-accent-amber',
    },
  ]

  const recentInspections = [
    {
      id: '1',
      asset: 'Tower A-01',
      status: 'Completed',
      score: 85,
      date: '2024-06-05',
    },
    {
      id: '2',
      asset: 'Pole B-15',
      status: 'Processing',
      score: null,
      date: '2024-06-04',
    },
    {
      id: '3',
      asset: 'Rail C-07',
      status: 'Completed',
      score: 72,
      date: '2024-06-03',
    },
  ]

  const recentTickets = [
    { id: 'T001', priority: 'P1', status: 'OPEN', title: 'Corrosion detected', dueDate: '2024-06-07' },
    { id: 'T002', priority: 'P2', status: 'IN_PROGRESS', title: 'Vegetation overgrowth', dueDate: '2024-06-15' },
    { id: 'T003', priority: 'P3', status: 'OPEN', title: 'Missing component', dueDate: '2024-06-20' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">Dashboard</h1>
        <p className="mt-2 text-white">Overview of your infrastructure inspection operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className={`bg-gradient-to-br from-dark-700 from-opacity-40 to-dark-800 to-opacity-20 border-opacity-30 hover:border-opacity-100 group-hover:shadow-xl group-hover:shadow-${stat.gradient}-500/30`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-3 bg-gradient-to-br ${stat.gradient} opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-${stat.gradient}-500/50`}>
                    <Icon className={`h-6 w-6 text-white`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Inspections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between border-b border-dark-600 border-opacity-30 pb-4 last:border-0 hover:border-accent-cyan hover:border-opacity-50 transition-colors">
                    <div>
                      <p className="font-medium text-white">{inspection.asset}</p>
                      <p className="text-sm text-white">{inspection.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${inspection.status === 'Completed' ? 'text-accent-green' : 'text-accent-amber'}`}>
                        {inspection.status}
                      </p>
                      {inspection.score && <p className="text-sm text-white">Score: {inspection.score}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between border-b border-dark-600 border-opacity-30 pb-4 last:border-0 hover:border-accent-cyan hover:border-opacity-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded bg-dark-700 px-2 py-1 text-xs font-medium bg-gradient-to-r from-accent-blue to-accent-cyan bg-opacity-20 text-accent-cyan">
                          {ticket.priority}
                        </span>
                        <p className="font-medium text-white">{ticket.title}</p>
                      </div>
                      <p className="text-sm text-white">Due: {ticket.dueDate}</p>
                    </div>
                    <div>
                      <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        ticket.status === 'OPEN' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-accent-amber bg-opacity-20 text-accent-amber' :
                        'bg-accent-green bg-opacity-20 text-accent-green'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
