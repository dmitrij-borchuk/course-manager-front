import { useCallback, useState } from 'react'
import { editTeacher, getTeacher } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { User } from '../types/user'
import { UserInfo } from '../types/userInfo'

export default function useTeachersStore() {
  const [teachersById, setTeachersById] = useState<Dictionary<User | undefined>>({})
  const [loading, setLoading] = useState(false)

  return {
    teachersById,
    loading,
    setTeacher: useCallback((id: string, data?: User) => {
      setTeachersById((state) => ({ ...state, [id]: data }))
    }, []),
    fetchTeacher: useCallback(async (id: string) => {
      setLoading(true)
      const resp = await getTeacher(id)
      setTeachersById((state) => ({ ...state, [id]: resp.data }))
      setLoading(false)
    }, []),
    editTeacher: useCallback(async (data: User) => {
      if (!data.user_info) {
        throw new Error('"user_info" field is absent')
      }

      setLoading(true)
      await editTeacher({
        userInfoId: data.user_info.id,
        ...data.user_info,
      })
      setTeachersById((state) => ({ ...state, [data.id]: data }))
      setLoading(false)
    }, []),
  }
}
