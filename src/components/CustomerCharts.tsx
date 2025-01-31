'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F43F5E',
  '#8B5CF6',
  '#F59E0B',
  '#6366F1',
]
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Sample data for testing
const SAMPLE_WEEKLY_DATA = [
  { name: 'Mon', customers: 4 },
  { name: 'Tue', customers: 3 },
  { name: 'Wed', customers: 5 },
  { name: 'Thu', customers: 2 },
  { name: 'Fri', customers: 6 },
  { name: 'Sat', customers: 4 },
  { name: 'Sun', customers: 3 },
]

const SAMPLE_TIME_DATA = [
  { name: 'Morning', value: 12 },
  { name: 'Afternoon', value: 8 },
  { name: 'Evening', value: 15 },
]

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-blue-600">
          Customers: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function CustomerCharts() {
  const [weeklyCustomers, setWeeklyCustomers] = useState(SAMPLE_WEEKLY_DATA)
  const [timeDistribution, setTimeDistribution] = useState(SAMPLE_TIME_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const supabase = createClientComponentClient()
        const today = new Date()
        const startOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay(),
        )
        const endOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + (6 - today.getDay()),
        )

        // Fetch customers by day of week
        const { data: weekData, error: weekError } = await supabase
          .from('customers')
          .select('created_at')
          .gte('created_at', startOfWeek.toISOString())
          .lte('created_at', endOfWeek.toISOString())

        // Fetch customers by time of day
        const { data: timeData, error: timeError } = await supabase
          .from('customers')
          .select('created_at')

        if (weekError || timeError) {
          throw new Error('Error fetching chart data')
        }

        if (weekData && weekData.length > 0) {
          // Process weekly customers
          const processedWeeklyData = WEEKDAYS.map((day, index) => ({
            name: day,
            customers: weekData.filter(
              (customer) => new Date(customer.created_at).getDay() === index,
            ).length,
          }))
          setWeeklyCustomers(processedWeeklyData)
        }

        if (timeData && timeData.length > 0) {
          // Process time distribution
          const processedTimeData = timeData.reduce(
            (acc, customer) => {
              const hour = new Date(customer.created_at).getHours()
              if (hour >= 5 && hour < 12) {
                acc[0].value++
              } else if (hour >= 12 && hour < 17) {
                acc[1].value++
              } else {
                acc[2].value++
              }
              return acc
            },
            [
              { name: 'Morning', value: 0 },
              { name: 'Afternoon', value: 0 },
              { name: 'Evening', value: 0 },
            ],
          )
          setTimeDistribution(processedTimeData)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-6 w-1/2 rounded bg-gray-200"></CardTitle>
            </CardHeader>
            <CardContent className="h-64 rounded bg-gray-100"></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Customers This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={weeklyCustomers}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: '#4B5563' }}
                axisLine={{ stroke: '#9CA3AF' }}
              />
              <YAxis
                tick={{ fill: '#4B5563' }}
                axisLine={{ stroke: '#9CA3AF' }}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="customers"
                fill="#3B82F6"
                activeBar={{ fill: '#2563EB' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">
            Customers Visited the Shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={timeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {timeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F3F4F6',
                  borderColor: '#D1D5DB',
                  color: '#1F2937',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  paddingTop: '10px',
                  color: '#4B5563',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
