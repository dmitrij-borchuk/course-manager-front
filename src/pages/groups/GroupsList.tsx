import { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useGroups } from 'store/groupsStore'
import { GroupsList } from '../../components/groups/GroupsList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'

export const GroupsListPage = () => {
  const { fetching, groups, rateByGroup, filter, updateFilter } = useActivitiesData()

  return (
    <>
      <Helmet>
        <title>Groups{TITLE_POSTFIX}</title>
      </Helmet>
      <GroupsList
        items={groups}
        loading={fetching}
        attendanceRates={rateByGroup}
        onFiltersChange={updateFilter}
        filter={filter}
      />
    </>
  )
}

export default GroupsListPage

export function useActivitiesData() {
  const orgKey = useOrgId()
  const [filter, setFilter] = useState<Filter>(
    JSON.parse(localStorage.getItem('groupsFilter') || '{"showArchived": false}')
  )
  const updateFilter = useCallback((filter) => {
    setFilter(filter)
    localStorage.setItem('groupsFilter', JSON.stringify(filter))
  }, [])

  const groupsQuery = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(orgKey, groupsIds)
  const attendances = attendanceQuery.data || []
  const rateByGroup = useAttendanceRateByGroups(groups || [], attendances)

  return {
    filter,
    updateFilter,
    groups,
    fetching: groupsQuery.isLoading,
    attendances: attendanceQuery.data,
    rateByGroup,
  }
}

type Filter = {
  showArchived: boolean
}
