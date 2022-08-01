import { ComponentProps, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker, Preloader } from 'react-materialize'
import { Select } from '../../components/kit/select/Select'
import { TagsEditor } from '../../components/kit/tag/TagsEditor'
import { Text } from '../../components/kit/text/Text'
import { ReportByTag } from '../../components/reports/ReportByTag'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useOrgId } from '../../hooks/useOrgId'
import { usePersistenceState } from '../../hooks/usePersistenceState'
import { useAttendancesState, useStudentsState } from '../../store'
import { SortOrder } from '../../types/sorting'

export const ReportByTagTab = () => {
  const intl = useIntl()
  const orgKey = useOrgId()
  const org = useCurrentOrg()
  const orgId = org?.id
  const [to, setTo] = useState(new Date())
  const [from, setFrom] = useState(subMonth(to))
  const [order, setOrder] = usePersistenceState<SortOrder>(orderStoreKey, 'asc')
  const { fetchStudents, students, fetching: studentsFetching } = useStudentsState()
  const { attendances, fetchAllAttendances } = useAttendancesState()
  const [tags, setTags] = useState<string[]>([])
  const onTagsUpdate = useCallback(
    (newTags: string[]) => {
      setTags(newTags)
    },
    [setTags]
  )
  const tagsLower = tags.map((t) => t.toLowerCase())
  // TODO: optimize
  const studentsWithTags = students.filter((s) => {
    if (!s.tags) {
      return false
    }

    // TODO: At least one or all of
    return s.tags.filter((sTag) => tagsLower.includes(sTag.toLowerCase())).length > 0
  })

  useEffect(() => {
    if (orgId) {
      fetchStudents(orgId)
    }
  }, [fetchStudents, orgId])

  useEffect(() => {
    fetchAllAttendances(orgKey, from, to)
  }, [fetchAllAttendances, from, orgKey, to])

  if (studentsFetching) {
    return (
      <div className="flex justify-center pt-4">
        <Preloader color="red" flashing={false} size="medium" />
      </div>
    )
  }

  return (
    <div>
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
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <TagsEditor value={tags} onUpdate={onTagsUpdate} inputClassName="w-full" />
        </div>
        <div className="flex items-end row">
          <Select
            onChange={(e) => setOrder(e.target.value as SortOrder)}
            id="sortSelect"
            label={intl.formatMessage({ id: 'reports.sortOrder' })}
            value={order}
            s={12}
          >
            <option value="asc">{intl.formatMessage({ id: 'common.sort.asc' })}</option>
            <option value="desc">{intl.formatMessage({ id: 'common.sort.desc' })}</option>
          </Select>
        </div>
      </div>
      <ReportBody attendances={attendances} tags={tags} students={studentsWithTags} order={order} />
    </div>
  )
}

const orderStoreKey = 'reports.attendance.order'
const ReportBody = (props: ComponentProps<typeof ReportByTag>) => {
  const { tags } = props
  if (!tags.length) {
    return (
      <Text type="h6" color="textGray">
        <FormattedMessage id="reports.noTagsSelected" />
      </Text>
    )
  }

  return <ReportByTag {...props} tags={tags} />
}

const dayWithoutSecondInMs = 24 * 60 * 60 * 1000 - 60 * 1000

function subMonth(date: Date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() - 1)
  return newDate
}
