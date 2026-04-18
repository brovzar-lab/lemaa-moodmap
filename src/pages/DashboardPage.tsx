import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useAllEntries } from '../hooks/useAllEntries'

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...dates].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  let expected = today
  for (const d of sorted) {
    if (d === expected) {
      streak++
      const dt = new Date(expected)
      dt.setDate(dt.getDate() - 1)
      expected = dt.toISOString().split('T')[0]
    } else {
      break
    }
  }
  return streak
}

function last14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data: entries, isLoading, isError } = useAllEntries(user?.uid ?? '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-600">
        Failed to load entries. Please refresh.
      </div>
    )
  }

  const allEntries = entries ?? []
  const entryMap = new Map(allEntries.map((e) => [e.date, e]))
  const totalCount = allEntries.length
  const streak = calcStreak(allEntries.map((e) => e.date))
  const hasEnoughForCorrelations = totalCount >= 7

  const chartDays = last14Days()
  const chartData = chartDays.map((date) => {
    const entry = entryMap.get(date)
    return {
      date: shortDate(date),
      mood: entry?.mood ?? null,
      energy: entry?.energy ?? null,
    }
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your mood & energy over the last 14 days</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-indigo-600">{streak}</div>
          <div className="text-sm text-gray-500 mt-1">Day streak</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-indigo-600">{totalCount}</div>
          <div className="text-sm text-gray-500 mt-1">Total entries</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {totalCount === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No entries yet — start logging your mood!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                domain={[1, 10]}
                ticks={[1, 3, 5, 7, 10]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(value) => (value == null ? ['—'] : [value as number])}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Line
                type="monotone"
                dataKey="mood"
                name="Mood"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                name="Energy"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="text-center">
        {hasEnoughForCorrelations ? (
          <Link
            to="/correlations"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Correlations
          </Link>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="text-sm font-medium text-amber-800 mb-2">
              Keep logging! {7 - totalCount} more {7 - totalCount === 1 ? 'day' : 'days'} needed
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all"
                style={{ width: `${(totalCount / 7) * 100}%` }}
              />
            </div>
            <p className="text-xs text-amber-600 mt-2">
              {totalCount}/7 entries to unlock correlations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
