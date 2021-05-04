import { useCallback, useState } from 'react'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { createStudent, deleteStudent, getStudent, getStudents, updateStudent } from '../services/students'
import { Dictionary } from '../types/dictionary'
import { NewStudent, Student, StudentFull } from '../types/student'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsById, setStudentsById] = useState<Dictionary<StudentFull>>({})
  const students = useDictionaryToArray(studentsById)
  const [submitting, setSubmitting] = useState(false)

  return {
    students,
    studentsById,
    fetching,
    submitting,
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
    createStudent: useCallback(async (data: NewStudent) => {
      setSubmitting(true)
      const result = await createStudent(data)
      setStudentsById((state) => ({ ...state, [result.data.id]: result.data }))
      setSubmitting(false)

      return result
    }, []),
    editStudent: useCallback(async (data: Student) => {
      setSubmitting(true)
      const response = await updateStudent(data)
      setStudentsById((state) => ({
        ...state,
        [data.id]: response.data,
      }))
      setSubmitting(false)
    }, []),
    deleteStudent: useCallback(async (id: string) => {
      await deleteStudent(id)

      setStudentsById((state) => {
        delete state[id]

        return state
      })
    }, []),
  }
}
