import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, CircularProgress } from '@mui/material'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { Select } from '../../components/kit/select/Select'
import { Text } from '../../components/kit/text/Text'
import { ReportByGroup } from '../../components/reports/ReportByGroup'
import { getItem, setItem } from '../../services/localStore'
import { useGroupsState, useStudentsOfGroupState } from '../../store'
import { Activity } from '../../types/activity'
import { SortOrder } from 'utils/sorting'
import { DatePicker } from 'components/kit/inputs/datePicker'

export const ReportByGroupTab = () => {
  const intl = useIntl()
  const [group, setGroup] = useState<Activity>()
  const [order, setOrder] = useState<SortOrder>(getItem(orderStoreKey) || 'asc')

  // Range
  const [to, setTo] = useState(new Date())
  const [from, setFrom] = useState(subMonth(to))

  const { fetchStudentsOfGroup, studentsOfGroup, fetching: studentsFetching } = useStudentsOfGroupState()
  const { fetchGroups, groups, groupsById, fetching: groupsFetching } = useGroupsState()

  const attendanceQuery = useAttendancesForGroups(group ? [group.outerId] : [])
  const attendances = attendanceQuery.data
  const attendancesForReport = useMemo(() => {
    if (!attendances) {
      return []
    }

    return attendances.filter((a) => {
      const date = a.date
      return date >= from.getTime() && date <= to.getTime()
    })
  }, [attendances, from, to])

  useEffect(() => {
    setItem(orderStoreKey, order)
  }, [order])

  useEffect(() => {
    if (group) {
      fetchStudentsOfGroup(group.id)
    }
  }, [fetchStudentsOfGroup, group])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    if (groups.length) {
      setGroup(groups[0])
    }
  }, [groups])

  if (groupsFetching) {
    return (
      <div className="flex justify-center pt-4">
        <CircularProgress />
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
            fullWidth
            defaultValue={from}
            label={`${intl.formatMessage({ id: 'common.from' })} *`}
            onChange={(date) => setFrom(date ?? new Date())}
          />
        </div>
        <div className="">
          <DatePicker
            fullWidth
            defaultValue={to}
            label={`${intl.formatMessage({ id: 'common.to' })} *`}
            onChange={(date) => {
              const d = date ?? new Date()
              setTo(date ?? new Date())
              setTo(new Date(d.getTime() + dayWithoutSecondInMs))
            }}
          />
        </div>
      </div>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          onChange={(e) => setGroup(groupsById.get(parseInt(e.target.value, 10)))}
          label={intl.formatMessage({ id: 'reports.groupSelector.label' })}
        >
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

        <Box display="flex" gap={2}>
          <ReportBody
            attendances={attendancesForReport}
            group={group}
            students={studentsOfGroup}
            order={order}
            loading={studentsFetching}
            from={from}
            to={to}
          />
        </Box>
      </div>
    </div>
  )
}

const orderStoreKey = 'reports.attendance.order'
const ReportBody = (
  props: Omit<ComponentProps<typeof ReportByGroup>, 'group'> & { group?: Activity; loading: boolean }
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
