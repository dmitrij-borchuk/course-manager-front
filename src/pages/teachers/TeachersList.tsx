import { useCallback, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useOrgId } from '../../hooks/useOrgId'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useAttendancesState, useTeachersState } from '../../store'
import { useAttendanceRateByTeacher } from '../../hooks/useAttendanceRate'

export const TeachersListPage = () => {
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const orgId = useOrgId()
  const { addToast } = useToasts()
  const { attendances, clearAttendances, fetchAllAttendances } = useAttendancesState()
  // TODO: should we calculate rate for a period of time (semester, year) or for the all attendance reports?
  // Probably we need to use `fetchAttendancesForGroups`
  // so we will calculate attendance rate only for ongoing groups
  const rateByTeacher = useAttendanceRateByTeacher(attendances)
  const fetchList = useCallback(async () => {
    if (!orgId) {
      throw new Error('Organization name not found')
    }
    try {
      await fetchTeachers(orgId)
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchTeachers, orgId])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  useEffect(() => {
    fetchAllAttendances(orgId)
    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAllAttendances, orgId])

  return <TeachersList items={teachers} loading={fetching} attendanceRates={rateByTeacher} />
}
