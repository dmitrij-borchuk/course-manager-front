import { useCallback, useState } from 'react'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { deleteStudent } from '../services/students'
import { Dictionary } from '../types/dictionary'
import { NewStudent, Student } from '../types/student'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsById, setStudentsById] = useState<Dictionary<Student>>({})
  const students = useDictionaryToArray(studentsById)
  const [submitting, setSubmitting] = useState(false)
  const fetchStudent = useCallback(async (orgId: string, id: string) => {
    setFetching(true)
    const collection = makeOrgCollection<Student>('students', orgId)
    const resp = await collection.getById(id)
    setStudentsById((state) => ({ ...state, [resp.id]: resp }))
    setFetching(false)
  }, [])

  return {
    students,
    studentsById,
    fetching,
    submitting,
    fetchStudents: useCallback(async (orgId: string) => {
      setFetching(true)
      const collection = makeOrgCollection<Student>('students', orgId)
      const resp = await collection.getAll()
      const studentsById = arrayToDictionary(resp)
      setStudentsById(studentsById)
      setFetching(false)
    }, []),
    fetchStudent,
    createStudent: useCallback(async (orgId: string, data: NewStudent) => {
      setSubmitting(true)
      const collection = makeOrgCollection<Student>('students', orgId)

      try {
        const result = await collection.save(data)
        setStudentsById((state) => ({ ...state, [result.id]: { ...data, id: result.id } }))
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    editStudent: useCallback(async (orgId: string, data: Student) => {
      setSubmitting(true)
      const collection = makeOrgCollection<Student>('students', orgId)
      try {
        const result = await collection.save(data)
        setStudentsById((state) => ({
          ...state,
          [result.id]: {
            ...state[result.id],
            ...data,
          },
        }))
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    // TODO: verify
    deleteStudent: useCallback(async (id: string) => {
      await deleteStudent(id)

      setStudentsById((state) => {
        delete state[id]

        return state
      })
    }, []),
    clearStudents: useCallback(() => {
      setStudentsById({})
    }, []),
  }
}
