import { useEffect } from 'react'
import { GroupsList } from '../../components/groups/GroupsList'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useGroupsState } from '../../store'

export const GroupsListPage = () => {
  const { fetchGroups, clearGroups, groups, loading } = useGroupsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const orgId = useOrgId()
  const rateByGroup = useAttendanceRateByGroups(groups, attendances)

  useEffect(() => {
    if (orgId) {
      fetchGroups(orgId)
      return () => {
        clearGroups()
      }
    }
  }, [clearGroups, fetchGroups, orgId])

  useEffect(() => {
    if (groups.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgId,
        groups.map((g) => g.id)
      )
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, groups, orgId])

  return <GroupsList items={groups} loading={loading} attendanceRates={rateByGroup} />
}

export default GroupsListPage
