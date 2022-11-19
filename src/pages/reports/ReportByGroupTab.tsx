import { ComponentProps, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker, Preloader } from 'react-materialize'
import { Select } from '../../components/kit/select/Select'
import { Text } from '../../components/kit/text/Text'
import { ReportByGroup } from '../../components/reports/ReportByGroup'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useOrgId } from '../../hooks/useOrgId'
import { getItem, setItem } from '../../services/localStore'
import { useAttendancesState, useGroupsState, useStudentsOfGroupState } from '../../store'
import { Group } from '../../types/group'
import { SortOrder } from '../../types/sorting'

export const ReportByGroupTab = () => {
  const intl = useIntl()
  const org = useCurrentOrg()
  const orgId = org?.id
  const orgKey = useOrgId()
  const [group, setGroup] = useState<Group>()
  const [order, setOrder] = useState<SortOrder>(getItem(orderStoreKey) || 'asc')

  // Range
  const [to, setTo] = useState(new Date())
  const [from, setFrom] = useState(subMonth(to))

  const { fetchStudentsOfGroup, studentsOfGroup, fetching: studentsFetching } = useStudentsOfGroupState()
  const { fetchGroups, groups, groupsById, fetching: groupsFetching } = useGroupsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const attendancesForReport = attendances.filter((a) => {
    const date = a.date
    return date >= from.getTime() && date <= to.getTime()
  })
  const fetchAttendance = useCallback(
    async (group: Group) => {
      await fetchAttendancesForGroups(orgKey, [group.id])
    },
    [fetchAttendancesForGroups, orgKey]
  )

  useEffect(() => {
    setItem(orderStoreKey, order)
  }, [order])

  useEffect(() => {
    if (group && orgId) {
      fetchStudentsOfGroup(orgId, orgKey, group.id)
    }
  }, [fetchStudentsOfGroup, group, orgId, orgKey])

  useEffect(() => {
    if (group) {
      fetchAttendance(group)
    }

    return () => clearAttendances()
  }, [clearAttendances, fetchAttendance, group])

  useEffect(() => {
    fetchGroups(orgKey)
  }, [fetchGroups, orgKey])

  useEffect(() => {
    if (groups.length) {
      setGroup(groups[0])
    }
  }, [groups])

  if (groupsFetching) {
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

  // TODO: responsive
  return (
    <div>
      {/* Range */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <DatePicker
            id="dateFrom"
            options={{
              autoClose: true,
              format: 'mmm dd, yyyy',
              defaultDate: from,
              setDefaultDate: true,
              maxDate: new Date(),
            }}
            // @ts-ignore
            label={`${intl.formatMessage({ id: 'common.from' })} *`}
            onChange={setFrom}
            s={12}
          />
        </div>
        <div className="">
          <DatePicker
            id="dateTo"
            options={{
              autoClose: true,
              format: 'mmm dd, yyyy',
              defaultDate: to,
              setDefaultDate: true,
              maxDate: new Date(),
            }}
            // @ts-ignore
            label={`${intl.formatMessage({ id: 'common.to' })} *`}
            onChange={(d) => setTo(new Date(d.getTime() + dayWithoutSecondInMs))}
            s={12}
          />
        </div>
      </div>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <ReportBody
          attendances={attendancesForReport}
          group={group}
          students={studentsOfGroup}
          order={order}
          loading={studentsFetching}
          from={from}
          to={to}
        />
      </div>
    </div>
  )
}

const orderStoreKey = 'reports.attendance.order'
const ReportBody = (
  props: Omit<ComponentProps<typeof ReportByGroup>, 'group'> & { group?: Group; loading: boolean }
) => {
  const { group, loading } = props
  if (!group) {
    return (
      <Text type="h6" color="textGray">
        <FormattedMessage id="reports.noGroupSelected" />
      </Text>
    )
  }

  return <ReportByGroup {...props} group={group} loading={loading} />
}

const dayWithoutSecondInMs = 24 * 60 * 60 * 1000 - 60 * 1000

function subMonth(date: Date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() - 1)
  return newDate
}
