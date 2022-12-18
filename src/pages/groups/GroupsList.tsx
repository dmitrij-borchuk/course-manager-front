import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { GroupsList } from '../../components/groups/GroupsList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useGroupsState } from '../../store'

export const GroupsListPage = () => {
  const { fetchGroups, clearGroups, groups, fetching } = useGroupsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const orgKey = useOrgId()
  const rateByGroup = useAttendanceRateByGroups(groups, attendances)

  useEffect(() => {
    fetchGroups()
    return () => {
      clearGroups()
    }
  }, [clearGroups, fetchGroups])

  useEffect(() => {
    if (groups.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgKey,
        groups.map((g) => g.outerId)
      )
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, groups, orgKey])

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
