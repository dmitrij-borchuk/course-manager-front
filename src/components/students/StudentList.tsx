import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
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
  const { onSort, sortId, sortOrder, sortedItems } = useSortingByHeader(items, attendanceRates)

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
          { id: 'attendanceRate', label: <FormattedMessage id="students.list.attendanceRate.label" />, sortable: true },
        ],
        onSort,
        sortOrder,
      }}
    />
  )
}

type SortProps = 'name' | 'attendanceRate'

type TableContentItem = {
  id: string
  name: string
  attendanceRate?: number
}

function useSortingByHeader(items: Student[] = [], attendanceRates?: Dictionary<number>) {
  const [sortId, setSortId] = useState<SortProps>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const onSort = useCallback((newSortId: SortProps, order: 'asc' | 'desc') => {
    setSortId(newSortId)
    setSortOrder(order)
  }, [])

  const sortedItems: TableContentItem[] = useMemo(() => {
    return items
      .map((s) => ({
        id: s.id,
        name: s.name,
        attendanceRate: attendanceRates && attendanceRates[s.id],
      }))
      .sort((a, b) => {
        const aValue = a[sortId]
        const bValue = b[sortId]
        if (aValue === bValue) {
          return 0
        }
        if (!aValue) {
          return sortOrder === 'asc' ? -1 : 1
        }
        if (!bValue) {
          return sortOrder === 'asc' ? 1 : -1
        }
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : 1
        }
        return aValue > bValue ? -1 : 1
      })
  }, [attendanceRates, items, sortId, sortOrder])

  return {
    sortId,
    sortOrder,
    onSort,
    sortedItems,
  }
}
