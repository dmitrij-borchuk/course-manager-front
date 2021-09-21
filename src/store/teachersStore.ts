import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { deleteTeacher, editTeacher, getTeacher, getTeachersList } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const history = useHistory()
  const [teachersById, setTeachersById] = useState<Dictionary<OrganizationUser>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  return {
    teachers,
    teachersById,
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
      const resp = await getTeachersList(orgId)
      const itemsById = arrayToDictionary(resp)
      setTeachersById(itemsById)
      setFetching(false)
    }, []),
    fetchTeacher: useCallback(async (orgId: string, id: string) => {
      setFetching(true)
      const resp = await getTeacher(orgId, id)
      setTeachersById((state) => ({ ...state, [id]: resp }))
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
