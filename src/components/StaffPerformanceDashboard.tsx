'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'

interface StaffRevenue {
  name: string
  revenue: number
}

interface TopPerformer {
  rank: number
  name: string
  sales: number
}

interface StaffPerformanceDashboardProps {
  totalRevenue: number
  staffRevenue: StaffRevenue[]
  topPerformers: TopPerformer[]
}

const getBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-400 hover:bg-yellow-400/80'
    case 2:
      return 'bg-gray-400 hover:bg-gray-400/80'
    case 3:
      return 'bg-amber-600 hover:bg-amber-600/80'
    default:
      return ''
  }
}

export function StaffPerformanceDashboard({
  totalRevenue,
  staffRevenue,
  topPerformers,
}: StaffPerformanceDashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Revenue Card */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Revenue Generated By The Staff
        </h2>
        <p className="mb-4 text-lg text-muted-foreground">
          Total Revenue: ₹{totalRevenue}
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={staffRevenue}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => `₹${value}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#7c3aed"
                radius={[0, 4, 4, 0]}
                barSize={15}
                label={{
                  position: 'right',
                  formatter: (value: number) => `₹${value}`,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Performers Card */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Top Performing Staff</h2>
        <div className="space-y-4">
          {topPerformers.map((performer) => (
            <div
              key={performer.rank}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <Badge className={getBadgeColor(performer.rank)}>
                {performer.rank === 1 && '🥇'}
                {performer.rank === 2 && '🥈'}
                {performer.rank === 3 && '🥉'}
              </Badge>
              <span className="flex-1 px-4">{performer.name}</span>
              <span className="text-muted-foreground">
                {performer.sales} sales
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
