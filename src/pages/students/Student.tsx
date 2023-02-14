import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Activity } from 'types/activity'
import { useGroups } from 'store/groupsStore'
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
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const date = useMemo(() => new Date(), [])
  const query = useGroups({
    archived: 'all',
    participantId: id,
    date,
  })
  const groups = query.data?.data || emptyGroups
  const fetchingGroups = query.isLoading
  const student = studentsById.get(id)
  const orgKey = useOrgId()
  const organization = useCurrentOrg()
  const orgId = organization?.id

  const onDelete = useCallback(async () => {
    if (organization && student) {
      await deleteStudent(orgKey, organization.id, id, student.outerId)
      // TODO: Add notification
      history.push(`/${orgKey}${ROUTES.STUDENTS_LIST}`)
    }
  }, [deleteStudent, history, id, orgKey, organization, student])

  const rateByGroups = useStudentAttendanceRateByGroups(student?.outerId, groups, attendances)

  useEffect(() => {
    if (orgId) {
      fetchStudent(orgId, id)
    }
  }, [fetchStudent, id, orgId])

  useEffect(() => {
    if (groups.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgKey,
        groups.map((g) => g.outerId)
      )
    }
  }, [fetchAttendancesForGroups, groups, orgKey])
  useEffect(() => {
    return () => {
      clearAttendances()
    }
  }, [clearAttendances])

  if (!student) {
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
