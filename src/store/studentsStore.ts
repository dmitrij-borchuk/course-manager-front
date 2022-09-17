import { useCallback, useState } from 'react'
import { nanoid } from 'nanoid'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { NewStudent, Student } from '../types/student'
import { arrayToDictionary } from '../utils/common'
import { StudentOfGroup } from '../types/studentOfGroup'
import { fetchStudentsByOrg, migrateStudents, fetchStudent, deleteStudent } from '../api/students'

export default function useStudentsStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsById, setStudentsById] = useState<Dictionary<Student>>({})
  const students = useDictionaryToArray(studentsById)
  const [submittingSemaphore, setSubmittingSemaphore] = useState(0)
  const getStudent = useCallback(async (orgId: number, id: number) => {
    setFetching(true)
    const resp = await fetchStudent(orgId, id)
    setStudentsById((state) => ({ ...state, [resp.data.id]: resp.data }))
    setFetching(false)
  }, [])

  return {
    students,
    studentsById,
    fetching,
    submitting: submittingSemaphore > 0,
    fetchStudents: useCallback(async (orgId: number) => {
      setFetching(true)
      const resp = await fetchStudentsByOrg(orgId)
      const studentsById = arrayToDictionary(resp.data)
      setStudentsById(studentsById)
      setFetching(false)
    }, []),
    fetchStudent: getStudent,
    createStudent: useCallback(async (orgId: string, data: NewStudent) => {
      setSubmittingSemaphore((v) => v + 1)
      const collection = makeOrgCollection<Student>('students', orgId)

      try {
        const result = await collection.save({ ...data, name: data.name.trim(), id: nanoid() })
        setStudentsById((state) => ({ ...state, [result.id]: { ...data, id: result.id, outerId: result.id } }))
        setSubmittingSemaphore((v) => v - 1)
        return result
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
    editStudent: useCallback(async (orgId: string, data: Student) => {
      setSubmittingSemaphore((v) => v + 1)
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
        setSubmittingSemaphore((v) => v - 1)
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
    deleteStudent: useCallback(async (orgKey: string, orgId: number, id: number, outerId: string) => {
      // Remove students from group
      const student2groupCollection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgKey)
      const resp = await student2groupCollection.query('studentId', '==', outerId)
      await Promise.all(resp.map((item) => student2groupCollection.delete(item.id)))

      // Remove student itself
      await deleteStudent(orgId, id)
      setStudentsById((state) => {
        delete state[id]

        return {
          ...state,
        }
      })
    }, []),
    clearStudents: useCallback(() => {
      setStudentsById({})
    }, []),
    migrate: useCallback(async () => {
      try {
        setSubmittingSemaphore((v) => v + 1)
        const result = await migrateStudents()
        setSubmittingSemaphore((v) => v - 1)
        return result
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
  }
}
