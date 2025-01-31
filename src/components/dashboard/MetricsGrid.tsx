import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const metrics = [
  { title: 'Total Bills', key: 'totalBills', color: 'bg-green-100' },
  { title: 'Net Value', key: 'netValue', color: 'bg-gray-100' },
  { title: 'Tax Value', key: 'taxValue', color: 'bg-yellow-100' },
  { title: 'Gross Value', key: 'grossValue', color: 'bg-yellow-100' },
  { title: 'Avg. Bill', key: 'avgBill', color: 'bg-blue-100' },
  { title: 'Expenses', key: 'expenses', color: 'bg-red-100' },
  { title: 'Cancelled', key: 'cancelled', color: 'bg-purple-100' },
  { title: 'Appointments', key: 'appointments', color: 'bg-pink-100' },
]

interface MetricsGridProps {
  data?: any[] | null
  loading?: boolean
}

export function MetricsGrid({ data, loading }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {loading
        ? metrics.map((metric, index) => (
            <Skeleton
              key={index}
              className={cn('h-32 rounded-lg', metric.color)}
            />
          ))
        : metrics.map((metric) => (
            <Card
              key={metric.key}
              className={cn(
                'flex flex-col justify-between space-y-2 p-4 shadow-sm',
                'bg-gradient-to-br from-white to-pink-50/50',
                metric.color,
              )}
            >
              <div className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </div>
              <div className="text-2xl font-bold">
                {data && data[0] ? data[0][metric.key] || 'N/A' : 'N/A'}
              </div>
              <div className="text-xs text-green-600">
                +12.5% from last month
              </div>
            </Card>
          ))}
    </div>
  )
}
