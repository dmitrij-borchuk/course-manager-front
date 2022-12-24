import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListPage } from '../kit/ListPage'

interface Props {
  loading?: boolean
  className?: string
  items?: Activity[]
  attendanceRates?: Dictionary<number>
}
export const GroupsList: React.FC<Props> = ({ className = '', loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const renderItem = useCallback(
    (g: TableContentItem) => {
      const attendanceRate = attendanceRates ? attendanceRates[g.id] : null
      return (
        <div className="flex justify-between">
          <Ellipsis>{g.name}</Ellipsis>
          {attendanceRate && <AttendanceRateBadge value={attendanceRate} />}
        </div>
      )
    },
    [attendanceRates]
  )
  const { onSort, sortId, sortOrder, sortedItems } = useSortingByHeader(items, attendanceRates)

  return (
    <ListPage
      className={className}
      items={sortedItems}
      loading={loading}
      fabBtnLink={`/${orgId}${ROUTES.GROUPS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.GROUPS_ROOT}`}
      listHeader={<FormattedMessage id="groups.list.title" />}
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
    />
  )
}

type SortProps = 'name' | 'attendanceRate'

type TableContentItem = {
  id: number
  name: string
  attendanceRate?: number
}
function useSortingByHeader(items: Activity[] = [], attendanceRates?: Dictionary<number>) {
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
        if (aValue === undefined) {
          return sortOrder === 'asc' ? -1 : 1
        }
        if (bValue === undefined) {
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
