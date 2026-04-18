import { useQuery } from '@tanstack/react-query'
import type { WeatherData } from '../types'

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  return {
    temp: Math.round(data.main.temp),
    condition: data.weather[0]?.description ?? 'unknown',
    humidity: data.main.humidity,
  }
}

async function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
  )
}

export function useWeather() {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather'],
    queryFn: async () => {
      const pos = await getPosition()
      return fetchWeather(pos.coords.latitude, pos.coords.longitude)
    },
    staleTime: 1000 * 60 * 30,
    retry: false,
  })
}
