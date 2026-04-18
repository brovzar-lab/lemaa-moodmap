import { useQuery } from '@tanstack/react-query'
import { getTodayEntry } from '../lib/firestore'
import type { MoodEntry } from '../types'

export function useTodayEntry(uid: string) {
  return useQuery<MoodEntry | null, Error>({
    queryKey: ['moodEntry', 'today', uid],
    queryFn: () => getTodayEntry(uid),
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  })
}
