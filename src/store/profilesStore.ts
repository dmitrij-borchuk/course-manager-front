import { useCallback, useState } from 'react'
import { getProfilesRequest } from 'api/profiles'
import { useMapToArray } from '../hooks/useMapToArray'
import { Profile } from 'types/profile'

export default function useProfilesStore() {
  const [profilesById, setProfilesById] = useState<Map<number, Profile>>(new Map())
  const profiles = useMapToArray(profilesById)
  const [error, setError] = useState<Error>()
  const [fetching, setFetching] = useState(false)

  return {
    profiles,
    error,
    fetching,
    profilesById,
    fetchProfiles: useCallback(async () => {
      setFetching(true)
      try {
        const resp = await getProfilesRequest()
        const entries: [number, Profile][] = resp.data.map((item) => [item.id, item])
        setProfilesById(new Map(entries))
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        }

        throw error
      }
      setFetching(false)
    }, []),
  }
}
