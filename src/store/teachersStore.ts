import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { deleteTeacher, editTeacher, getTeacher, getTeachersList } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { UserInfo, UserInfoFull } from '../types/userInfo'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const history = useHistory()
  const [teachersById, setTeachersById] = useState<Dictionary<UserInfoFull>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  return {
    teachers,
    teachersById,
    fetching,
    submitting,
    setTeacher: useCallback((id: string, data?: UserInfoFull) => {
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
      setFetching(true)
      const resp = await getTeachersList()
      const itemsById = arrayToDictionary(resp.data)
      setTeachersById(itemsById)
      setFetching(false)
    }, []),
    fetchTeacher: useCallback(async (id: string) => {
      setFetching(true)
      const resp = await getTeacher(id)
      setTeachersById((state) => ({ ...state, [id]: resp.data }))
      setFetching(false)
    }, []),
    editTeacher: useCallback(async (data: UserInfo) => {
      if (!data.user) {
        throw new Error('"user" field is absent')
      }

      setSubmitting(true)
      const response = await editTeacher(data)
      setTeachersById((state) => ({
        ...state,
        [data.id]: response.data,
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
