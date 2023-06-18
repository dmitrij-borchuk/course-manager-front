import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery } from 'react-query'
import { Helmet } from 'react-helmet'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useNotification } from 'hooks/useNotification'
import { TITLE_POSTFIX } from '../../config'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { getProfileRequest, updateProfileRequest } from 'modules/profiles/api'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useGroups } from 'store/groupsStore'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  const { filter } = useActivitiesFiltering()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)

  const query = useQuery(['profile', id], () => getProfileRequest(id))
  const teacher = query.data?.data
  const fetching = query.isLoading

  const { showError, showSuccess } = useNotification()
  const mutation = useMutation((name: string) => updateProfileRequest(id, name), {
    onError: (error: AxiosError) => showError(error.response?.data?.message),
    onSuccess: async () => {
      await query.refetch()
      showSuccess(<FormattedMessage id="profile.user.nameChanged" />)
    },
  })

  const groupsQuery = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
    performerId: teacher?.user.id,
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(groupsIds)
  const attendances = attendanceQuery.data || []
  const rateByGroup = useAttendanceRateByGroups(groups || [], attendances)

  // TODO: 404

  return (
    <>
      <Helmet>
        <title>Teacher{TITLE_POSTFIX}</title>
      </Helmet>

      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>
        {teacher && (
          <Teacher
            key={id}
            data={teacher}
            attendanceRates={rateByGroup}
            teachersGroups={groups}
            onEdit={mutation.mutateAsync}
          />
        )}
      </Loader>
    </>
  )
}
