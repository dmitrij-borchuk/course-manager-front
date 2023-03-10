import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Activity } from 'types/activity'
import { useGroups, useParticipation } from 'store/groupsStore'
import { useStudentsState } from '../../store'
import { useAttendancesState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { TITLE_POSTFIX } from '../../config'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'

// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const { attendances, clearAttendances, fetchAttendances } = useAttendancesState()
  const date = useMemo(() => new Date(), [])
  const query = useGroups({
    archived: 'all',
    participantId: id,
    date,
  })
  const allActivitiesQuery = useGroups({
    archived: 'all',
    participantId: id,
    deleted: 'all',
  })
  const participationQuery = useParticipation({
    participantId: id,
  })
  const groups = query.data?.data || emptyGroups
  const fetchingGroups = query.isLoading
  const student = studentsById.get(id)
  const orgKey = useOrgId()
  useEffect(() => {
    participationQuery.data?.data.forEach((p) => {
      fetchAttendances(orgKey, {
        activity: p.activity.outerId,
        from: new Date(p.startDate),
        to: p.endDate ? new Date(p.endDate) : undefined,
      })
    })
  }, [fetchAttendances, orgKey, participationQuery.data?.data])
  const organization = useCurrentOrg()

  const onDelete = useCallback(async () => {
    if (organization && student) {
      await deleteStudent(orgKey, organization.id, id, student.outerId)
      // TODO: Add notification
      history.push(`/${orgKey}${ROUTES.STUDENTS_LIST}`)
    }
  }, [deleteStudent, history, id, orgKey, organization, student])

  const rateByGroups = useStudentAttendanceRateByGroups(student?.outerId, groups, attendances)

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])

  useEffect(() => {
    return () => {
      clearAttendances()
    }
  }, [clearAttendances])

  if (!student || allActivitiesQuery.isLoading) {
    return (
      <div key="loader" data-testid="preloader">
        Loading
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Student{TITLE_POSTFIX}</title>
      </Helmet>

      <Student
        data={student}
        onDelete={onDelete}
        groups={groups}
        loadingGroups={fetchingGroups}
        attendanceRates={rateByGroups}
      />
    </>
  )
}

export default StudentPage

const emptyGroups: Activity[] = []
