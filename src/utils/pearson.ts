export function pearsonR(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n < 2) return 0
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, denomX = 0, denomY = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX
    const dy = ys[i] - meanY
    num += dx * dy
    denomX += dx * dx
    denomY += dy * dy
  }
  const denom = Math.sqrt(denomX * denomY)
  return denom === 0 ? 0 : num / denom
}

export interface CorrelationPair {
  labelX: string
  labelY: string
  xs: number[]
  ys: number[]
  r: number
}

export function buildCorrelationLabel(labelX: string, labelY: string, r: number): string {
  const strength = Math.abs(r)
  const direction = r > 0 ? 'positive' : 'negative'
  if (strength < 0.2) return `Weak link between ${labelX} and ${labelY}`

  const templates: Record<string, Record<string, string>> = {
    positive: {
      'mood-sleep': 'Good sleep = better mood',
      'mood-steps': 'More steps = higher mood',
      'mood-weather_temp': 'Warmer days = better mood',
      'energy-sleep': 'Good sleep = more energy',
      'energy-steps': 'More steps = more energy',
    },
    negative: {
      'mood-sleep': 'Less sleep = lower mood',
      'mood-steps': 'Fewer steps = lower mood',
      'mood-weather_temp': 'Cooler days = lower mood',
      'energy-sleep': 'Less sleep = less energy',
      'energy-steps': 'Fewer steps = less energy',
    },
  }

  const key = `${labelY}-${labelX}`
  return templates[direction]?.[key] ?? `${labelX} and ${labelY} are ${direction}ly correlated`
}
