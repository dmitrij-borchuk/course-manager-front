import { useCallback, useMemo, useState } from 'react'
import { getUserByOuterIdRequest, getUserRequest, getUsersRequest } from '../api/users'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const [teachersById, setTeachersById] = useState<Dictionary<OrganizationUser>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)
  const teachersByOuterId = useMemo(() => {
    const result: Dictionary<OrganizationUser> = {}
    teachers.forEach((teacher) => {
      if (teacher.outerId) {
        result[teacher.outerId] = teacher
      }
    })
    return result
  }, [teachers])

  return {
    teachers,
    teachersById,
    teachersByOuterId,
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
    fetchTeacherByOuterId: useCallback(async (orgId: number, id: string) => {
      setFetching(true)
      const resp = await getUserByOuterIdRequest(orgId, id)
      setTeachersById((state) => ({ ...state, [resp.data.id]: resp.data }))
      setFetching(false)
    }, []),
  }
}
