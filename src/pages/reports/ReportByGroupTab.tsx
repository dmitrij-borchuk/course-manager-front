import { ComponentProps, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Preloader } from 'react-materialize'
import { Select } from '../../components/kit/select/Select'
import { Text } from '../../components/kit/text/Text'
import { ReportByGroup } from '../../components/reports/ReportByGroup'
import { useOrgId } from '../../hooks/useOrgId'
import { getItem, setItem } from '../../services/localStore'
import { useAttendancesState, useGroupsState, useStudentsOfGroupState } from '../../store'
import { Group } from '../../types/group'
import { SortOrder } from '../../types/sorting'

export const ReportByGroupTab = () => {
  const intl = useIntl()
  const orgId = useOrgId()
  const [group, setGroup] = useState<Group>()
  const [order, setOrder] = useState<SortOrder>(getItem(orderStoreKey) || 'asc')
  const { fetchStudentsOfGroup, studentsOfGroup, fetching: studentsFetching } = useStudentsOfGroupState()
  const { fetchGroups, groups, groupsById, fetching: groupsFetching } = useGroupsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const fetchAttendance = useCallback(
    async (group: Group) => {
      await fetchAttendancesForGroups(orgId, [group.id])
    },
    [fetchAttendancesForGroups, orgId]
  )

  useEffect(() => {
    setItem(orderStoreKey, order)
  }, [order])

  useEffect(() => {
    if (group) {
      fetchStudentsOfGroup(orgId, group.id)
    }
  }, [fetchStudentsOfGroup, group, orgId])

  useEffect(() => {
    if (group) {
      fetchAttendance(group)
    }

    return () => clearAttendances()
  }, [clearAttendances, fetchAttendance, group])

  useEffect(() => {
    fetchGroups(orgId)
  }, [fetchGroups, orgId])

  useEffect(() => {
    if (groups.length) {
      setGroup(groups[0])
    }
  }, [groups])

  if (studentsFetching || groupsFetching) {
    return (
      <div className="flex justify-center pt-4">
        <Preloader color="red" flashing={false} size="medium" />
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex justify-center pt-4">
        <Text type="h6" color="textGray">
          <FormattedMessage id="reports.noGroups" />
        </Text>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 pt-4">
      <Select onChange={(e) => setGroup(groupsById[e.target.value])}>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </Select>
      <Select
        onChange={(e) => setOrder(e.target.value as SortOrder)}
        id="sortSelect"
        label={intl.formatMessage({ id: 'reports.sortOrder' })}
        value={order}
      >
        <option value="asc">{intl.formatMessage({ id: 'common.sort.asc' })}</option>
        <option value="desc">{intl.formatMessage({ id: 'common.sort.desc' })}</option>
      </Select>

      <ReportBody attendances={attendances} group={group} students={studentsOfGroup} order={order} />
    </div>
  )
}

const orderStoreKey = 'reports.attendance.order'
const ReportBody = (props: Omit<ComponentProps<typeof ReportByGroup>, 'group'> & { group?: Group }) => {
  const { group } = props
  if (!group) {
    return (
      <Text type="h6" color="textGray">
        <FormattedMessage id="reports.noGroupSelected" />
      </Text>
    )
  }

  return <ReportByGroup {...props} group={group} />
}
