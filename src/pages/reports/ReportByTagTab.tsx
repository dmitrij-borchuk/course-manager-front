import { ComponentProps, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Preloader } from 'react-materialize'
import { Select } from '../../components/kit/select/Select'
import { TagsEditor } from '../../components/kit/tag/TagsEditor'
import { Text } from '../../components/kit/text/Text'
import { ReportByTag } from '../../components/reports/ReportByTag'
import { useOrgId } from '../../hooks/useOrgId'
import { usePersistenceState } from '../../hooks/usePersistenceState'
import { useAttendancesState, useStudentsState } from '../../store'
import { SortOrder } from '../../types/sorting'

export const ReportByTagTab = () => {
  const intl = useIntl()
  const orgId = useOrgId()
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
  const studentsWithTags = students.filter((s) => {
    if (!s.tags) {
      return false
    }

    return s.tags.filter((sTag) => tags.includes(sTag)).length > 0
  })

  useEffect(() => {
    fetchStudents(orgId)
  }, [fetchStudents, orgId])

  useEffect(() => {
    fetchAllAttendances(orgId)
  }, [fetchAllAttendances, orgId])

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