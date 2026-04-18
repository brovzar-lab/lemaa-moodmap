import { Timestamp } from 'firebase/firestore'
import type { MoodEntryWithDate } from './firestore'

// Hardcoded values — no runtime randomness, same data every load
const STATIC_VALUES = [
  { mood: 5, energy: 5, sleep: 6.5, steps: 5200, temp: 14, condition: 'cloudy', humidity: 70, tags: ['tired'] },
  { mood: 6, energy: 6, sleep: 7.0, steps: 6800, temp: 16, condition: 'partly cloudy', humidity: 65, tags: ['focused'] },
  { mood: 8, energy: 8, sleep: 8.5, steps: 10200, temp: 19, condition: 'sunny', humidity: 50, tags: ['workout', 'focused'] },
  { mood: 7, energy: 7, sleep: 7.5, steps: 8100, temp: 20, condition: 'sunny', humidity: 48, tags: ['social'] },
  { mood: 4, energy: 4, sleep: 5.5, steps: 3100, temp: 12, condition: 'rainy', humidity: 85, tags: ['stressed'] },
  { mood: 5, energy: 5, sleep: 6.0, steps: 4500, temp: 13, condition: 'cloudy', humidity: 78, tags: ['tired'] },
  { mood: 7, energy: 6, sleep: 7.0, steps: 7200, temp: 17, condition: 'partly cloudy', humidity: 62, tags: ['relaxed'] },
  { mood: 9, energy: 9, sleep: 9.0, steps: 11500, temp: 22, condition: 'sunny', humidity: 45, tags: ['workout', 'social'] },
  { mood: 8, energy: 8, sleep: 8.0, steps: 9800, temp: 21, condition: 'sunny', humidity: 47, tags: ['focused'] },
  { mood: 6, energy: 6, sleep: 6.5, steps: 6300, temp: 18, condition: 'partly cloudy', humidity: 60, tags: ['relaxed'] },
  { mood: 5, energy: 4, sleep: 5.5, steps: 3800, temp: 11, condition: 'rainy', humidity: 88, tags: ['stressed', 'tired'] },
  { mood: 6, energy: 6, sleep: 7.0, steps: 6100, temp: 15, condition: 'cloudy', humidity: 72, tags: ['focused'] },
  { mood: 7, energy: 7, sleep: 7.5, steps: 7800, temp: 18, condition: 'partly cloudy', humidity: 58, tags: ['social'] },
  { mood: 8, energy: 8, sleep: 8.5, steps: 10500, temp: 23, condition: 'sunny', humidity: 42, tags: ['workout'] },
  { mood: 9, energy: 9, sleep: 9.0, steps: 12000, temp: 24, condition: 'sunny', humidity: 40, tags: ['workout', 'focused'] },
  { mood: 7, energy: 7, sleep: 7.5, steps: 8400, temp: 21, condition: 'sunny', humidity: 46, tags: ['relaxed'] },
  { mood: 5, energy: 5, sleep: 6.0, steps: 4800, temp: 14, condition: 'cloudy', humidity: 75, tags: ['tired'] },
  { mood: 6, energy: 6, sleep: 7.0, steps: 6500, temp: 17, condition: 'partly cloudy', humidity: 63, tags: ['focused'] },
  { mood: 8, energy: 7, sleep: 8.0, steps: 9200, temp: 20, condition: 'sunny', humidity: 51, tags: ['social', 'relaxed'] },
  { mood: 9, energy: 8, sleep: 8.5, steps: 10800, temp: 22, condition: 'sunny', humidity: 44, tags: ['workout'] },
  { mood: 7, energy: 7, sleep: 7.5, steps: 7600, temp: 19, condition: 'partly cloudy', humidity: 56, tags: ['focused'] },
]

function dateOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

// i=0 is oldest (21 days ago), i=20 is yesterday (1 day ago)
export const DEMO_ENTRIES: MoodEntryWithDate[] = STATIC_VALUES.map((v, i) => ({
  date: dateOffset(21 - i),
  mood: v.mood,
  energy: v.energy,
  tags: [...v.tags],
  weather: { temp: v.temp, condition: v.condition, humidity: v.humidity },
  health: { sleep: v.sleep, steps: v.steps },
  createdAt: Timestamp.fromDate(new Date(dateOffset(21 - i) + 'T12:00:00')),
}))

export const DEMO_TAGS = ['focused', 'tired', 'social', 'workout', 'stressed', 'relaxed']

export const DEMO_WEATHER = { temp: 19, condition: 'partly cloudy', humidity: 56 }
