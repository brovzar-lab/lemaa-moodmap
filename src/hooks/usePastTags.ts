import { useQuery } from '@tanstack/react-query'
import { getPastTags } from '../lib/firestore'
import { isDemoMode } from '../lib/demoMode'
import { DEMO_TAGS } from '../lib/demoData'

export function usePastTags(uid: string) {
  return useQuery<string[], Error>({
    queryKey: ['pastTags', uid],
    queryFn: () => getPastTags(uid),
    enabled: !isDemoMode && !!uid,
    initialData: isDemoMode ? DEMO_TAGS : undefined,
    staleTime: 1000 * 60 * 10,
  })
}
