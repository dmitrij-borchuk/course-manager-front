import { useCallback, useState } from 'react'
import { getUserRequest, getUsersRequest } from '../api/users'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const [teachersById, setTeachersById] = useState<Dictionary<OrganizationUser>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)

  return {
    teachers,
    teachersById,
    fetching,
    setTeacher: useCallback((id: string, data?: OrganizationUser) => {
      setTeachersById((state) => {
        if (data) {
          return { ...state, [id]: data }
        }

        delete state[id]

        return {
          ...state,
        }
      })
    }, []),
    fetchTeachers: useCallback(async (orgId: number) => {
      setFetching(true)
      const resp = await getUsersRequest(orgId)
      const itemsById = arrayToDictionary(resp.data)
      setTeachersById((state) => ({ ...state, ...itemsById }))
      setFetching(false)
    }, []),
    fetchTeacher: useCallback(async (orgId: number, id: number) => {
      setFetching(true)
      const resp = await getUserRequest(orgId, id)
      setTeachersById((state) => ({ ...state, [id]: resp.data }))
      setFetching(false)
    }, []),
  }
}
