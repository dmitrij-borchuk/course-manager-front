import { useCallback, useState } from 'react'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { getStudent, getStudents } from '../services/students'
import { Dictionary } from '../types/dictionary'
import { StudentFull } from '../types/student'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsStore() {
  const [loading, setLoading] = useState(false)
  const [studentsById, setStudentsById] = useState<Dictionary<StudentFull>>({})
  const students = useDictionaryToArray(studentsById)

  return {
    students,
    studentsById,
    loading,
    fetchStudents: useCallback(async (props?: Parameters<typeof getStudents>[0]) => {
      setLoading(true)
      const resp = await getStudents(props)
      const groupsById = arrayToDictionary(resp.data)
      setStudentsById(groupsById)
      setLoading(false)
    }, []),
    fetchStudent: useCallback(async (id: string) => {
      setLoading(true)
      const resp = await getStudent(id)
      setStudentsById((state) => ({ ...state, [resp.data.id]: resp.data }))
      setLoading(false)
    }, []),
  }
}
