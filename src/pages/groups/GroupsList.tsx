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
