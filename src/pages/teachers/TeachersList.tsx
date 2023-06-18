import { useMemo } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { useGroups } from 'store/groupsStore'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useAttendanceRateByTeacher } from '../../hooks/useAttendanceRate'
import { TITLE_POSTFIX } from '../../config'
import { useQuery } from 'react-query'
import { getProfilesRequest } from 'modules/profiles/api'

// TODO: rename to ProfilesListPage
export const TeachersListPage = () => {
  const query = useQuery('profiles', getProfilesRequest, {
    onError: (error: Error) => {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    },
  })
  const profiles = query.data?.data
  const fetching = query.isLoading
  const { addToast } = useToasts()
  const processed = useMemo(() => {
    return profiles?.map((p) => ({
      ...p,
      outerId: p.user.outerId,
    }))
  }, [profiles])

  // TODO: need to add pagination and filtering,
  // but it's not implemented on the backend yet
  const groupsQuery = useGroups({
    archived: 'false',
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(groupsIds)
  const attendances = attendanceQuery.data || []
  const rateByTeacher = useAttendanceRateByTeacher(attendances)

  return (
    <>
      <Helmet>
        <title>Teachers{TITLE_POSTFIX}</title>
      </Helmet>

      <TeachersList items={processed} loading={fetching} attendanceRates={rateByTeacher} />
    </>
  )
}
