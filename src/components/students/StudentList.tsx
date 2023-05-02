import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSortingByHeader } from 'utils/sorting'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListPage } from '../kit/ListPage'
import { Text } from '../kit/text/Text'

interface Props {
  loading?: boolean
  className?: string
  items?: Student[]
  attendanceRates?: Dictionary<number>
}
export const StudentList: React.FC<Props> = ({ className = '', loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const renderItem = useCallback((d: TableContentItem) => {
    return (
      <div className="flex justify-between">
        <Ellipsis>
          {d.name || (
            <Text color="textGray" className="my-0">
              <FormattedMessage id="common.unknownName" />
            </Text>
          )}
        </Ellipsis>
        {typeof d.attendanceRate === 'number' && <AttendanceRateBadge value={d.attendanceRate} />}
      </div>
    )
  }, [])
  const preparedData: TableContentItem[] = useMemo(() => {
    return items.map((s) => ({
      id: s.id,
      name: s.name,
      outerId: s.outerId,
      attendanceRate: attendanceRates && attendanceRates[s.outerId],
    }))
  }, [items, attendanceRates])
  const getData = useCallback((d: TableContentItem, prop: keyof TableContentItem) => d[prop], [])
  const { onSort, sortId, sortOrder, sortedItems } = useSortingByHeader(preparedData, {
    defaultSortId: 'name',
    getData,
  })

  return (
    <ListPage
      className={className}
      items={sortedItems}
      loading={loading}
      fabBtnLink={`/${orgId}${ROUTES.STUDENTS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.STUDENTS_ROOT}`}
      listHeader={<FormattedMessage id="students.list.title" />}
      labelProp="name"
      renderItem={renderItem}
      header={{
        sortId,
        items: [
          { id: 'name', label: <FormattedMessage id="common.name.label" />, sortable: true },
          { id: 'attendanceRate', label: <FormattedMessage id="attendance.listItem.header.title" />, sortable: true },
        ],
        onSort,
        sortOrder,
      }}
      filter={{
        predicate: (item: TableContentItem, filterTerm: string) =>
          item.name.toLowerCase().includes(filterTerm.toLowerCase()),
      }}
    />
  )
}

type TableContentItem = {
  id: number
  name: string
  attendanceRate?: number
}
