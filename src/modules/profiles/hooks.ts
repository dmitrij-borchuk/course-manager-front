import { useQuery } from 'react-query'
import { getProfilesRequest } from './api'

export function useProfiles(deleted?: boolean) {
  return useQuery('profiles', async () => (await getProfilesRequest(deleted)).data, {
    refetchOnWindowFocus: false,
  })
}
