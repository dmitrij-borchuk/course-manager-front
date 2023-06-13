import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useGroups } from 'store/groupsStore'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { GroupsList } from '../../components/groups/GroupsList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'

export const GroupsListPage = () => {
  const { fetching, groups, rateByGroup } = useActivitiesData()

  return (
    <>
      <Helmet>
        <title>Groups{TITLE_POSTFIX}</title>
      </Helmet>
      <GroupsList items={groups} loading={fetching} attendanceRates={rateByGroup} />
    </>
  )
}

export default GroupsListPage

export function useActivitiesData() {
  const { filter } = useActivitiesFiltering()

  // TODO: need to add pagination and filtering
  const groupsQuery = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(groupsIds)
  const attendances = attendanceQuery.data || []
  const rateByGroup = useAttendanceRateByGroups(groups || [], attendances)

  return {
    groups,
    fetching: groupsQuery.isLoading,
    attendances: attendanceQuery.data,
    rateByGroup,
  }
}
