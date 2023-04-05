import { useCallback, useEffect, useMemo } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { useGroups } from 'store/groupsStore'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useOrgId } from '../../hooks/useOrgId'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useTeachersState } from '../../store'
import { useAttendanceRateByTeacher } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { TITLE_POSTFIX } from '../../config'

export const TeachersListPage = () => {
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const orgKey = useOrgId()
  const { addToast } = useToasts()

  const groupsQuery = useGroups({
    archived: 'false',
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(orgKey, groupsIds)
  const attendances = attendanceQuery.data || []
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

  return (
    <>
      <Helmet>
        <title>Teachers{TITLE_POSTFIX}</title>
      </Helmet>

      <TeachersList items={teachers} loading={fetching} attendanceRates={rateByTeacher} />
    </>
  )
}
