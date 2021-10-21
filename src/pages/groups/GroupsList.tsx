import { useEffect, useMemo } from 'react'
import { GroupsList } from '../../components/groups/GroupsList'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useGroupsState } from '../../store'
import { Attendance } from '../../types/attendance'
import { Dictionary } from '../../types/dictionary'
import { groupBy } from '../../utils/common'

export const GroupsListPage = () => {
  const { fetchGroups, clearGroups, groups, loading } = useGroupsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const orgId = useOrgId()
  const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group), [attendances])
  const rateByGroup = useMemo(
    () =>
      (groups || []).reduce<Dictionary<number>>((acc, g) => {
        const attendancesOfGroup = attendancesByGroup[g.id] || []
        const classesRates = attendancesOfGroup.map((a) => getRateOfClass(a))
        const rate = getAverage(classesRates)

        if (!rate) {
          return acc
        }

        return {
          ...acc,
          [g.id]: rate,
        }
      }, {}),
    [attendancesByGroup, groups]
  )

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

function getRateOfClass(attendance: Attendance) {
  const values = Object.values(attendance.attended)
  const attended = values.filter((v) => !!v).length

  return attended / values.length
}

function getAverage(values: number[]) {
  if (values.length === 0) {
    return null
  }
  return values.reduce((acc, v) => acc + v) / values.length
}
