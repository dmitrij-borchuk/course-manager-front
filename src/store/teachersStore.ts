import { useCallback, useState } from 'react'
import { getTeacher } from '../services/teachers'
import { Dictionary } from '../types/dictionary'
import { User } from '../types/user'

export default function useTeachersStore() {
  const [teachersById, setTeachersById] = useState<Dictionary<User | undefined>>({})
  const [loading, setLoading] = useState(false)

  return {
    teachersById,
    loading,
    fetchTeachers: function () {
      throw new Error('TBD')
    },
    fetchTeacher: useCallback(async (id: string) => {
      setLoading(true)
      const resp = await getTeacher(id)
      setTeachersById((state) => ({ ...state, [id]: resp.data }))
      setLoading(false)
    }, []),
    setTeacher: useCallback((id: string, data?: User) => {
      setTeachersById((state) => ({ ...state, [id]: data }))
    }, []),
  }
}
