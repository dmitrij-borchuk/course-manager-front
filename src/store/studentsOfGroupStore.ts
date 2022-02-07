import { nanoid } from 'nanoid'
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
        const result = await collection.save({
          id: nanoid(),
          ...data,
        })
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
    fetchStudentsOfGroup: useCallback(async (orgId: string, groupId: string, date: Date) => {
      setFetching(true)
      try {
        const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
        const resp = await collection.queryMulti([
          ['groupId', '==', groupId],
          ['startDate', '<=', date.getTime()],
        ])
        const filtered = resp.filter((item) => item.endDate === null || item.endDate >= date.getTime())
        const studentIds = filtered.map((item) => item.studentId)

        if (!studentIds.length) {
          setFetching(false)
          return []
        }
        const students = makeOrgCollection<Student>('students', orgId)
        const studentsList = await students.getAll()
        const filteredByStudents = studentsList.filter((item) => studentIds.includes(item.id))
        const studentsById = arrayToDictionary(filteredByStudents)
        setStudentsOfGroupById(studentsById)

        setFetching(false)

        return filteredByStudents
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    fetchGroupsOfStudent: useCallback(async (orgId: string, studentIds: string[], date: Date) => {
      setFetching(true)
      const collection = makeOrgCollection<StudentOfGroup>('studentsToGroups', orgId)
      const resp = await collection.queryMulti([['startDate', '<=', date.getTime()]])
      const filteredByTime = resp.filter((item) => item.endDate === null || item.endDate >= date.getTime())
      const filteredByStudents = filteredByTime.filter((item) => studentIds.includes(item.studentId))
      const groupIds = filteredByStudents.map((item) => item.groupId)

      if (!groupIds.length) {
        setFetching(false)
        return []
      }
      const groups = makeOrgCollection<Group>('groups', orgId)
      const groupsList = await groups.getAll()
      const filteredGroups = groupsList.filter((item) => groupIds.includes(item.id))
      const groupsById = arrayToDictionary(filteredGroups)
      setGroupsOfStudentById(groupsById)
      setFetching(false)

      return filteredGroups
    }, []),
    clearStudentsOfGroup: useCallback(() => {
      setStudentsOfGroupById({})
    }, []),
    clearGroupOfStudents: useCallback(() => {
      setGroupsOfStudentById({})
    }, []),
  }
}
