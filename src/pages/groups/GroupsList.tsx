import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useGroups } from 'store/groupsStore'
import { GroupsList } from '../../components/groups/GroupsList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState } from '../../store'

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

function useActivitiesData() {
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
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const orgKey = useOrgId()
  const rateByGroup = useAttendanceRateByGroups(groups || [], attendances)

  useEffect(() => {
    if (groups?.length) {
      fetchAttendancesForGroups(
        orgKey,
        groups.map((g) => g.outerId)
      )
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, groups, orgKey])

  return {
    filter,
    updateFilter,
    groups,
    fetching: groupsQuery.isLoading,
    attendances,
    rateByGroup,
  }
}

type Filter = {
  showArchived: boolean
}
