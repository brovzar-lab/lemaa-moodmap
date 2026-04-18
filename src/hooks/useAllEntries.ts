import { useQuery } from '@tanstack/react-query'
import { getAllEntries } from '../lib/firestore'
import type { MoodEntryWithDate } from '../lib/firestore'

export function useAllEntries(uid: string) {
  return useQuery<MoodEntryWithDate[], Error>({
    queryKey: ['moodEntries', 'all', uid],
    queryFn: () => getAllEntries(uid),
    enabled: !!uid,
    staleTime: 1000 * 60 * 2,
  })
}
