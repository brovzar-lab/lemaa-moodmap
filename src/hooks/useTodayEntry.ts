import { useQuery } from '@tanstack/react-query'
import { getTodayEntry } from '../lib/firestore'
import { isDemoMode } from '../lib/demoMode'
import type { MoodEntry } from '../types'

export function useTodayEntry(uid: string) {
  return useQuery<MoodEntry | null, Error>({
    queryKey: ['moodEntry', 'today', uid],
    queryFn: () => getTodayEntry(uid),
    enabled: !isDemoMode && !!uid,
    initialData: isDemoMode ? null : undefined,
    staleTime: 1000 * 60 * 5,
  })
}
