import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { assignParticipant, fetchActivity, unassignParticipant } from '../modules/activities/api'
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
  const [submitting, setSubmitting] = useState(false)
  const queryClient = useQueryClient()

  return {
    studentsOfGroup,
    studentsOfGroupById,
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
    addGroupToStudent: useCallback(
      async (groupId: number, participantId: number) => {
        setSubmitting(true)

        try {
          const result = await assignParticipant(groupId, participantId)
          const groupResponse = await fetchActivity(groupId)
          const group = groupResponse.data
          queryClient.setQueryData<Activity[]>('groups', (old) => (old ? [...old, group] : [group]))
          setSubmitting(false)
          return result.data
        } catch (error) {
          setSubmitting(false)
          throw error
        }
      },
      [queryClient]
    ),
    deleteStudentFromGroup: useCallback(async (groupId: number, studentId: number, leaveReasonComment: string) => {
      setSubmitting(true)
      await unassignParticipant(groupId, studentId, leaveReasonComment)
      setStudentsOfGroupById((state) => {
        delete state[studentId]
        return { ...state }
      })
      setSubmitting(false)
    }, []),
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
    clearStudentsOfGroup: useCallback(() => {
      setStudentsOfGroupById({})
    }, []),
  }
}

export function useUnassignForActivity() {
  return useMutation((params: { participantId: number; activityId: number; leaveReasonComment: string }) =>
    unassignParticipant(params.activityId, params.participantId, params.leaveReasonComment)
  )
}
