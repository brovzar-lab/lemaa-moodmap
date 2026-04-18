import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useAllEntries } from '../hooks/useAllEntries'
import { pearsonR, buildCorrelationLabel } from '../utils/pearson'
import type { MoodEntryWithDate } from '../lib/firestore'

interface Pair {
  key: string
  labelX: string
  labelY: string
  getX: (e: MoodEntryWithDate) => number
  getY: (e: MoodEntryWithDate) => number
}

const PAIRS: Pair[] = [
  { key: 'mood-sleep', labelX: 'sleep', labelY: 'mood', getX: (e) => e.health.sleep, getY: (e) => e.mood },
  { key: 'mood-steps', labelX: 'steps', labelY: 'mood', getX: (e) => e.health.steps, getY: (e) => e.mood },
  { key: 'mood-weather_temp', labelX: 'weather_temp', labelY: 'mood', getX: (e) => e.weather.temp, getY: (e) => e.mood },
  { key: 'energy-sleep', labelX: 'sleep', labelY: 'energy', getX: (e) => e.health.sleep, getY: (e) => e.energy },
  { key: 'energy-steps', labelX: 'steps', labelY: 'energy', getX: (e) => e.health.steps, getY: (e) => e.energy },
]

function rColor(r: number): string {
  if (r >= 0.4) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (r >= 0.2) return 'text-sky-600 bg-sky-50 border-sky-200'
  if (r > -0.2) return 'text-gray-600 bg-gray-50 border-gray-200'
  if (r > -0.4) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

function rBadgeColor(r: number): string {
  return r >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
}

function displayLabel(labelX: string): string {
  const map: Record<string, string> = {
    sleep: 'Sleep',
    steps: 'Steps',
    weather_temp: 'Temp (°C)',
  }
  return map[labelX] ?? labelX
}

export function CorrelationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: entries, isLoading, isError } = useAllEntries(user?.uid ?? '')

  const totalCount = entries?.length ?? 0

  useEffect(() => {
    if (!isLoading && totalCount < 7) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoading, totalCount, navigate])

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

  if (totalCount < 7) return null

  const allEntries = entries!

  const computed = PAIRS.map((pair) => {
    const xs = allEntries.map(pair.getX)
    const ys = allEntries.map(pair.getY)
    const r = pearsonR(xs, ys)
    return { ...pair, xs, ys, r, absR: Math.abs(r) }
  })

  const top3 = [...computed].sort((a, b) => b.absR - a.absR).slice(0, 3)
  const topPair = top3[0]

  const scatterData = allEntries.map((e) => ({
    x: topPair.getX(e),
    y: topPair.getY(e),
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Correlations</h1>
        <p className="text-sm text-gray-500 mt-1">
          What factors predict your best days? Based on {totalCount} entries.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Top correlations
        </h2>
        {top3.map((pair, i) => (
          <div
            key={pair.key}
            className={`flex items-start gap-4 rounded-xl border p-4 ${rColor(pair.r)}`}
          >
            <div className="text-lg font-bold opacity-30 w-5 shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">
                {buildCorrelationLabel(pair.labelX, pair.labelY, pair.r)}
              </div>
              <div className="text-xs opacity-70 mt-0.5">
                {pair.labelY.charAt(0).toUpperCase() + pair.labelY.slice(1)} vs{' '}
                {displayLabel(pair.labelX)}
              </div>
            </div>
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${rBadgeColor(pair.r)}`}>
              r = {pair.r.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Scatter: {topPair.labelY.charAt(0).toUpperCase() + topPair.labelY.slice(1)} vs{' '}
          {displayLabel(topPair.labelX)}
        </h2>
        <p className="text-xs text-gray-400 mb-4">r = {topPair.r.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 4, right: 16, bottom: 24, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="x" type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} name={displayLabel(topPair.labelX)}>
              <Label value={displayLabel(topPair.labelX)} offset={-12} position="insideBottom" style={{ fontSize: 11, fill: '#9ca3af' }} />
            </XAxis>
            <YAxis dataKey="y" type="number" domain={[1, 10]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} name={topPair.labelY} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(value, name) => [value as number, (name as string) === 'x' ? displayLabel(topPair.labelX) : topPair.labelY]}
            />
            <Scatter data={scatterData} fill="#6366f1" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
