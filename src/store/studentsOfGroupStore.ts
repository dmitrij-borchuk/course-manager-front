import { useCallback, useState } from 'react'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { Student } from '../types/student'
import { NewStudentOfGroup, StudentOfGroup } from '../types/studentOfGroup'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsOfGroupStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsOfGroupById, setStudentsOfGroupById] = useState<Dictionary<Student>>({})
  const studentsOfGroup = useDictionaryToArray(studentsOfGroupById)
  const [submitting, setSubmitting] = useState(false)

  return {
    studentsOfGroup,
    studentsOfGroupById,
    fetching,
    submitting,
    addStudentToGroup: useCallback(async (orgId: string, data: NewStudentOfGroup) => {
      setSubmitting(true)
      const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)

      try {
        const result = await collection.save(data)
        const students = makeOrgCollection<Student>('students', orgId)
        const studentData = await students.getById(data.studentId)
        setStudentsOfGroupById((state) => ({ ...state, [studentData.id]: studentData }))
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    deleteStudentFromGroup: useCallback(async (orgId: string, studentId: string, groupId: string) => {
      setSubmitting(true)
      const student2groupCollection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
      const resp = await student2groupCollection.queryMulti([
        ['studentId', '==', studentId],
        ['groupId', '==', groupId],
      ])
      await Promise.all(resp.map((item) => student2groupCollection.delete(item.id)))
      setStudentsOfGroupById((state) => {
        resp.forEach((item) => delete state[item.studentId])
        return { ...state }
      })
      setSubmitting(false)
    }, []),
    fetchStudentsOfGroup: useCallback(async (orgId: string, groupId: string) => {
      setFetching(true)
      const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
      const resp = await collection.query('groupId', '==', groupId)
      const studentIds = resp.map((item) => item.studentId)

      if (!studentIds.length) {
        return []
      }
      const students = makeOrgCollection<Student>('students', orgId)
      const studentsList = await students.query('id', 'in', studentIds)
      const studentsById = arrayToDictionary(studentsList)
      setStudentsOfGroupById(studentsById)
      setFetching(false)

      return studentsList
    }, []),
    clearStudentsOfGroup: useCallback(() => {
      setStudentsOfGroupById({})
    }, []),
  }
}
