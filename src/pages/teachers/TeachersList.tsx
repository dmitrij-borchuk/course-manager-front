import { useMemo } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useQuery as useReactQuery } from 'react-query'
import { useGroups } from 'store/groupsStore'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { getProfilesRequest } from 'modules/profiles/api'
import { useQuery } from 'hooks/useQuery'
import { Profile } from 'types/profile'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useAttendanceRateByTeacher } from '../../hooks/useAttendanceRate'

// TODO: rename to ProfilesListPage
export const TeachersListPage = () => {
  const query = useReactQuery('profiles', () => getProfilesRequest(), {
    refetchOnWindowFocus: false,
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
  const filter = useQuery().get('filter') ?? ''
  const processed = useMemo(() => {
    return profiles
      ?.map((p) => ({
        ...p,
        outerId: p.user.outerId,
      }))
      .filter((p) => usersFilteringPredicate(p, filter))
  }, [profiles, filter])

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
      <TeachersList items={processed} loading={fetching} attendanceRates={rateByTeacher} />
    </>
  )
}

function usersFilteringPredicate(item: Profile, filterTerm: string) {
  if (filterTerm === '') return true
  return item.name ? item.name.toLowerCase().includes(filterTerm.toLowerCase()) : false
}
