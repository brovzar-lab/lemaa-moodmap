import { useQuery } from '@tanstack/react-query'
import { getPastTags } from '../lib/firestore'

export function usePastTags(uid: string) {
  return useQuery<string[], Error>({
    queryKey: ['pastTags', uid],
    queryFn: () => getPastTags(uid),
    enabled: !!uid,
    staleTime: 1000 * 60 * 10,
  })
}
