import { Timestamp } from 'firebase/firestore'

export interface WeatherData {
  temp: number
  condition: string
  humidity: number
}

export interface HealthData {
  sleep: number
  steps: number
}

export interface MoodEntry {
  mood: number
  energy: number
  tags: string[]
  weather: WeatherData
  health: HealthData
  createdAt: Timestamp
}

export type MoodEntryInput = Omit<MoodEntry, 'createdAt'>
