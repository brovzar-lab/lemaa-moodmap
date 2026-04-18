function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

export function seededRandom(seed: string): number {
  return (hashString(seed) % 10000) / 10000
}

export function getDailyHealthData(userId: string, date: string): { sleep: number; steps: number } {
  const sleepSeed = userId + date + 'sleep'
  const stepsSeed = userId + date + 'steps'
  return {
    sleep: seededRandom(sleepSeed) * 4 + 5,
    steps: seededRandom(stepsSeed) * 5000 + 3000,
  }
}
