import { useQuery } from '@tanstack/react-query'
import { getAllEntries } from '../lib/firestore'
import { isDemoMode } from '../lib/demoMode'
import { DEMO_ENTRIES } from '../lib/demoData'
import type { MoodEntryWithDate } from '../lib/firestore'

export function useAllEntries(uid: string) {
  return useQuery<MoodEntryWithDate[], Error>({
    queryKey: ['moodEntries', 'all', uid],
    queryFn: () => getAllEntries(uid),
    enabled: !isDemoMode && !!uid,
    initialData: isDemoMode ? DEMO_ENTRIES : undefined,
    staleTime: 1000 * 60 * 2,
  })
}
