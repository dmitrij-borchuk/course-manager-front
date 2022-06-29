import { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { getUserByOuterIdRequest, getUserRequest, getUsersRequest } from '../api/users'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { deleteTeacher, editTeacher } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const history = useHistory()
  const [teachersById, setTeachersById] = useState<Dictionary<OrganizationUser>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
    submitting,
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
    fetchTeachers: useCallback(async (orgId: string) => {
      setFetching(true)
      const resp = await getUsersRequest(orgId)
      const itemsById = arrayToDictionary(resp.data)
      setTeachersById((state) => ({ ...state, ...itemsById }))
      setFetching(false)
    }, []),
    fetchTeacher: useCallback(async (orgId: string, id: string) => {
      setFetching(true)
      const resp = await getUserRequest(orgId, id)
      setTeachersById((state) => ({ ...state, [id]: resp.data }))
      setFetching(false)
    }, []),
    fetchTeacherByOuterId: useCallback(async (orgId: string, id: string) => {
      setFetching(true)
      const resp = await getUserByOuterIdRequest(orgId, id)
      setTeachersById((state) => ({ ...state, [resp.data.id]: resp.data }))
      setFetching(false)
    }, []),
    editTeacher: useCallback(async (orgId: string, data: OrganizationUser) => {
      setSubmitting(true)
      await editTeacher(orgId, data)
      setTeachersById((state) => ({
        ...state,
        [data.id]: data,
      }))
      setSubmitting(false)
    }, []),
    // TODO: do we need it
    deleteTeacher: useCallback(
      async (id: string) => {
        setSubmitting(true)
        await deleteTeacher(id)
        setTeachersById((state) => {
          delete state[id]
          return state
        })
        setSubmitting(false)
        history.push(ROUTES.TEACHERS_LIST)
      },
      [history]
    ),
  }
}
