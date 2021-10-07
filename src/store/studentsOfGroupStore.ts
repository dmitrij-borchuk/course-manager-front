import { useCallback, useState } from 'react'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { Group } from '../types/group'
import { Student } from '../types/student'
import { NewStudentOfGroup, StudentOfGroup } from '../types/studentOfGroup'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsOfGroupStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsOfGroupById, setStudentsOfGroupById] = useState<Dictionary<Student>>({})
  const studentsOfGroup = useDictionaryToArray(studentsOfGroupById)
  const [groupsOfStudentById, setGroupsOfStudentById] = useState<Dictionary<Group>>({})
  const groupsOfStudent = useDictionaryToArray(groupsOfStudentById)
  const [submitting, setSubmitting] = useState(false)
  const unassignStudentFromGroup = useCallback(async (orgId: string, studentId: string, groupId: string) => {
    const student2groupCollection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
    const resp = await student2groupCollection.queryMulti([
      ['studentId', '==', studentId],
      ['groupId', '==', groupId],
      ['endDate', '==', null],
    ])
    await Promise.all(
      resp.map((item) => {
        item.endDate = new Date().getTime()
        return student2groupCollection.save(item)
      })
    )

    return resp
  }, [])

  return {
    studentsOfGroup,
    studentsOfGroupById,
    groupsOfStudent,
    groupsOfStudentById,
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
    addGroupToStudent: useCallback(async (orgId: string, data: NewStudentOfGroup) => {
      setSubmitting(true)
      const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)

      try {
        const result = await collection.save(data)
        const groups = makeOrgCollection<Group>('groups', orgId)
        const groupData = await groups.getById(data.groupId)
        setGroupsOfStudentById((state) => ({ ...state, [groupData.id]: groupData }))
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    deleteStudentFromGroup: useCallback(
      async (orgId: string, studentId: string, groupId: string) => {
        setSubmitting(true)
        const resp = await unassignStudentFromGroup(orgId, studentId, groupId)
        setStudentsOfGroupById((state) => {
          resp.forEach((item) => delete state[item.studentId])
          return { ...state }
        })
        setSubmitting(false)
      },
      [unassignStudentFromGroup]
    ),
    deleteGroupFromStudent: useCallback(
      async (orgId: string, groupId: string, studentId: string) => {
        setSubmitting(true)
        const resp = await unassignStudentFromGroup(orgId, studentId, groupId)
        setGroupsOfStudentById((state) => {
          resp.forEach((item) => delete state[item.groupId])
          return { ...state }
        })
        setSubmitting(false)
      },
      [unassignStudentFromGroup]
    ),
    fetchStudentsOfGroup: useCallback(async (orgId: string, groupId: string) => {
      setFetching(true)
      try {
        const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
        const resp = await collection.queryMulti([
          ['groupId', '==', groupId],
          ['endDate', '==', null],
        ])

        const studentIds = resp.map((item) => item.studentId)

        if (!studentIds.length) {
          setFetching(false)
          return []
        }
        const students = makeOrgCollection<Student>('students', orgId)
        const studentsList = await students.query('id', 'in', studentIds)
        const studentsById = arrayToDictionary(studentsList)
        setStudentsOfGroupById(studentsById)

        setFetching(false)

        return studentsList
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    fetchGroupsOfStudent: useCallback(async (orgId: string, studentId: string) => {
      setFetching(true)
      const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
      const resp = await collection.queryMulti([
        ['studentId', '==', studentId],
        ['endDate', '==', null],
      ])

      const groupIds = resp.map((item) => item.groupId)

      if (!groupIds.length) {
        setFetching(false)
        return []
      }
      const groups = makeOrgCollection<Group>('groups', orgId)
      const groupsList = await groups.query('id', 'in', groupIds)
      const groupsById = arrayToDictionary(groupsList)
      setGroupsOfStudentById(groupsById)
      setFetching(false)

      return groupsList
    }, []),
    clearStudentsOfGroup: useCallback(() => {
      setStudentsOfGroupById({})
    }, []),
    clearGroupOfStudents: useCallback(() => {
      setGroupsOfStudentById({})
    }, []),
  }
}
