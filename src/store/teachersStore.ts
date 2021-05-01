import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { deleteTeacher, editTeacher, getTeacher, getTeachersList } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { User } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useTeachersStore() {
  const history = useHistory()
  const [teachersById, setTeachersById] = useState<Dictionary<User>>({})
  const teachers = useDictionaryToArray(teachersById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  return {
    teachers,
    teachersById,
    fetching,
    submitting,
    setTeacher: useCallback((id: string, data?: User) => {
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
    editTeacher: useCallback(async (data: User) => {
      if (!data.user_info) {
        throw new Error('"user_info" field is absent')
      }

      setSubmitting(true)
      await editTeacher({
        userInfoId: data.user_info.id,
        ...data.user_info,
      })
      setTeachersById((state) => ({ ...state, [data.id]: data }))
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
