import { useCallback, useState } from 'react'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { getStudent, getStudents } from '../services/students'
import { Dictionary } from '../types/dictionary'
import { StudentFull } from '../types/student'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsById, setStudentsById] = useState<Dictionary<StudentFull>>({})
  const students = useDictionaryToArray(studentsById)

  return {
    students,
    studentsById,
    fetching,
    fetchStudents: useCallback(async (props?: Parameters<typeof getStudents>[0]) => {
      setFetching(true)
      const resp = await getStudents(props)
      const groupsById = arrayToDictionary(resp.data)
      setStudentsById(groupsById)
      setFetching(false)
    }, []),
    fetchStudent: useCallback(async (id: string) => {
      setFetching(true)
      const resp = await getStudent(id)
      setStudentsById((state) => ({ ...state, [resp.data.id]: resp.data }))
      setFetching(false)
    }, []),
  }
}
