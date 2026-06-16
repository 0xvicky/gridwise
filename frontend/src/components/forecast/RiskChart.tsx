import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components'
import { Forecast } from '@/types'

interface RiskChartProps {
  forecast: Forecast
}

export const RiskChart = ({ forecast }: RiskChartProps) => {
  const data = [
    { period: '30 days', risk: forecast.risk_30_days },
    { period: '60 days', risk: forecast.risk_60_days },
    { period: '90 days', risk: forecast.risk_90_days },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.18, duration: 0.45 }}
    >
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Risk Projection</CardTitle>
            <p className="mt-1 text-sm text-text-secondary">
              Predicted failure risk across the next 90 days
            </p>
          </div>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Risk']}
                contentStyle={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 18px 45px rgba(31, 41, 55, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#155959"
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', stroke: '#F38D26', strokeWidth: 3, r: 5 }}
                activeDot={{ fill: '#F38D26', stroke: '#FFFFFF', strokeWidth: 3, r: 7 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
