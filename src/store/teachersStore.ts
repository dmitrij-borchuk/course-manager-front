import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { useOrgId } from '../hooks/useOrgId'
import { deleteTeacher, editTeacher, getTeacher, getTeachersList } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const orgId = useOrgId()
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
    fetchTeachers: useCallback(async () => {
      if (!orgId) {
        throw new Error('Organization name not found')
      }
      setFetching(true)
      const resp = await getTeachersList(orgId)
      const itemsById = arrayToDictionary(resp)
      setTeachersById(itemsById)
      setFetching(false)
    }, [orgId]),
    fetchTeacher: useCallback(
      async (id: string) => {
        if (!orgId) {
          throw new Error('Organization name not found')
        }
        setFetching(true)
        const resp = await getTeacher(orgId, id)
        setTeachersById((state) => ({ ...state, [id]: resp }))
        setFetching(false)
      },
      [orgId]
    ),
    editTeacher: useCallback(
      async (data: OrganizationUser) => {
        if (!orgId) {
          throw new Error('Organization name not found')
        }

        setSubmitting(true)
        await editTeacher(orgId, data)
        setTeachersById((state) => ({
          ...state,
          [data.id]: data,
        }))
        setSubmitting(false)
      },
      [orgId]
    ),
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
