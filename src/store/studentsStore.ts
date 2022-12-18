import { useCallback, useState } from 'react'
import { nanoid } from 'nanoid'
import { NewStudent, Student } from '../types/student'
import {
  fetchStudentsByOrg,
  migrateStudents,
  fetchStudent,
  // deleteStudent,
  createStudent,
  editStudent,
} from '../api/students'

export type InitialStudentsState = {
  list?: Map<number, Student>
}
export default function useStudentsStore(initial: InitialStudentsState = {}) {
  const [fetching, setFetching] = useState(false)
  const [studentsById, setStudentsById] = useState<Map<number, Student>>(new Map(initial.list))
  const students = Array.from(studentsById.values())
  const [submittingSemaphore, setSubmittingSemaphore] = useState(0)
  const getStudent = useCallback(async (orgId: number, id: number) => {
    setFetching(true)
    const resp = await fetchStudent(orgId, id)
    setStudentsById((state) => {
      state.set(resp.data.id, resp.data)
      return new Map(state)
    })
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
      const studentsById = new Map(resp.data.map((item) => [item.id, item]))
      setStudentsById(studentsById)
      setFetching(false)
    }, []),
    fetchStudent: getStudent,
    createStudent: useCallback(async (orgId: number, data: NewStudent) => {
      setSubmittingSemaphore((v) => v + 1)

      try {
        const response = await createStudent(orgId, {
          ...data,
          name: data.name.trim(),
          outerId: nanoid(),
        })
        const result = response.data
        setStudentsById((state) => new Map(state).set(result.id, result))
        setSubmittingSemaphore((v) => v - 1)
        return result
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
    editStudent: useCallback(async (orgId: number, data: Student) => {
      setSubmittingSemaphore((v) => v + 1)
      try {
        const response = await editStudent(orgId, data.id, data)
        const result = response.data
        setStudentsById((state) => new Map(state).set(result.id, result))
        setSubmittingSemaphore((v) => v - 1)
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
    //   TODO: use new api (soft delete?)
    deleteStudent: useCallback(async (orgKey: string, orgId: number, id: number, outerId: string) => {
      throw new Error('Not implemented')
      // Remove students from group
      // const student2groupCollection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgKey)
      // const resp = await student2groupCollection.query('studentId', '==', outerId)
      // await Promise.all(resp.map((item) => student2groupCollection.delete(item.id)))

      // // Remove student itself
      // await deleteStudent(orgId, id)
      // setStudentsById((state) => {
      //   state.delete(id)

      //   return new Map(state)
      // })
    }, []),
    clearStudents: useCallback(() => {
      setStudentsById(new Map())
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
