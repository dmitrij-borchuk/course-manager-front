import { useCallback, useState } from 'react'
import { assignParticipant, fetchActivitiesByParticipant, fetchActivity, unassignParticipant } from '../api/activities'
import { fetchParticipantsByActivity } from '../api/participants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Activity } from '../types/activity'
import { Dictionary } from '../types/dictionary'
import { Student } from '../types/student'
import { arrayToDictionary } from '../utils/common'

export default function useStudentsOfGroupStore() {
  const [fetching, setFetching] = useState(false)
  const [studentsOfGroupById, setStudentsOfGroupById] = useState<Dictionary<Student>>({})
  const studentsOfGroup = useDictionaryToArray(studentsOfGroupById)
  const [groupsOfStudentById, setGroupsOfStudentById] = useState<Dictionary<Activity>>({})
  const groupsOfStudent = useDictionaryToArray(groupsOfStudentById)
  const [submitting, setSubmitting] = useState(false)
  const unassignStudentFromGroup = useCallback(async (studentId: number, groupId: number) => {
    return await unassignParticipant(groupId, studentId)
  }, [])

  return {
    studentsOfGroup,
    studentsOfGroupById,
    groupsOfStudent,
    groupsOfStudentById,
    fetching,
    submitting,
    addStudentToGroup: useCallback(async (activityId: number, participantId: number) => {
      setSubmitting(true)

      try {
        const result = await assignParticipant(activityId, participantId)
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    addGroupToStudent: useCallback(async (groupId: number, participantId: number) => {
      setSubmitting(true)

      try {
        const result = await assignParticipant(groupId, participantId)
        const groupResponse = await fetchActivity(groupId)
        const group = groupResponse.data
        setGroupsOfStudentById((state) => ({ ...state, [group.id]: group }))
        setSubmitting(false)
        return result.data
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    deleteStudentFromGroup: useCallback(async (groupId: number, studentId: number) => {
      setSubmitting(true)
      await unassignParticipant(groupId, studentId)
      setStudentsOfGroupById((state) => {
        delete state[studentId]
        return { ...state }
      })
      setSubmitting(false)
    }, []),
    deleteGroupFromStudent: useCallback(
      async (groupId: number, studentId: number) => {
        setSubmitting(true)
        try {
          await unassignStudentFromGroup(studentId, groupId)
          setGroupsOfStudentById((state) => {
            delete state[groupId]
            return { ...state }
          })
          setSubmitting(false)
        } catch (error) {
          setFetching(false)
          throw error
        }
      },
      [unassignStudentFromGroup]
    ),
    fetchStudentsOfGroup: useCallback(async (groupId: number, date = new Date()) => {
      setFetching(true)
      try {
        const resp = await fetchParticipantsByActivity(groupId, date)
        const students = resp.data
        const studentsById = arrayToDictionary(students)
        setStudentsOfGroupById(studentsById)

        setFetching(false)

        return students
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    fetchGroupsOfStudent: useCallback(async (studentId: number, date: Date) => {
      setFetching(true)
      try {
        const activities = await fetchActivitiesByParticipant(studentId, date)
        const groupsById = arrayToDictionary(activities.data)
        setGroupsOfStudentById(groupsById)
        setFetching(false)

        return activities.data
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    clearStudentsOfGroup: useCallback(() => {
      setStudentsOfGroupById({})
    }, []),
    clearGroupOfStudents: useCallback(() => {
      setGroupsOfStudentById({})
    }, []),
  }
}
