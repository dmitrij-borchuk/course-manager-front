import { useCallback, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { useOrgId } from '../../hooks/useOrgId'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useAttendancesState, useTeachersState } from '../../store'
import { useAttendanceRateByTeacher } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { TITLE_POSTFIX } from '../../config'

export const TeachersListPage = () => {
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const orgId = useOrgId()
  const { addToast } = useToasts()
  const { attendances, clearAttendances, fetchAllAttendances } = useAttendancesState()
  // TODO: should we calculate rate for a period of time (semester, year) or for the all attendance reports?
  // Probably we need to use `fetchAttendancesForGroups`
  // so we will calculate attendance rate only for ongoing groups
  const rateByTeacher = useAttendanceRateByTeacher(attendances)
  const org = useCurrentOrg()
  const fetchList = useCallback(async () => {
    if (!org?.id) {
      return
    }
    try {
      await fetchTeachers(org.id)
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchTeachers, org?.id])

  useEffect(() => {
    if (org?.id) {
      fetchList()
    }
  }, [fetchList, org])

  useEffect(() => {
    // TODO: optimize this
    fetchAllAttendances(orgId)
    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAllAttendances, orgId])

  return (
    <>
      <Helmet>
        <title>Teachers{TITLE_POSTFIX}</title>
      </Helmet>

      <TeachersList items={teachers} loading={fetching} attendanceRates={rateByTeacher} />
    </>
  )
}
