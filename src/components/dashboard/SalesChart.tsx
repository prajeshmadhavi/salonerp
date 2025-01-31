'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'

interface SalesChartProps {
  data: any[]
}

export function SalesChart({ data }: SalesChartProps) {
  // Sample data if no data is provided
  const sampleData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ]

  const chartData = data.length > 0 ? data : sampleData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,0,0,0.1)"
          vertical={false}
        />
        <XAxis dataKey="month" stroke="rgba(0,0,0,0.5)" fontSize={12} />
        <YAxis
          stroke="rgba(0,0,0,0.5)"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
