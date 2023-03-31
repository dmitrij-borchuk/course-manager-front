import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dictionary } from 'types/dictionary'
import { Activity } from 'types/activity'
import { AttendanceRateBadge } from 'components/kit/attendanceRateBadge/AttendancerateBadge'
import { ListWithLinks } from 'components/kit/list/List'
import { Ellipsis } from 'components/kit/ellipsis/Ellipsis'
import { useOrgId } from 'hooks/useOrgId'
import { ROUTES } from '../../../constants'

type Props = {
  items?: Activity[]
  attendanceRates?: Dictionary<number>
  loading?: boolean
}
export function ActivitiesList({ items, attendanceRates, loading }: Props) {
  const { onSort, sortId, sortOrder, sortedItems } = useSortingByHeader(items, attendanceRates)
  const orgKey = useOrgId()
  const renderItem = useCallback((g: TableContentItem) => {
    return (
      <div className={`flex justify-between transition-opacity ${g.archived ? 'opacity-40 hover:opacity-100' : ''}`}>
        <Ellipsis>
          {g.archived ? <FormattedMessage id="groups.archived.name" values={{ name: g.name }} /> : g.name}
        </Ellipsis>
        {g.attendanceRate && <AttendanceRateBadge value={g.attendanceRate} />}
      </div>
    )
  }, [])

  return (
    <ListWithLinks
      items={sortedItems}
      loading={loading}
      itemLinkRoot={`/${orgKey}${ROUTES.GROUPS_ROOT}`}
      labelProp="name"
      renderItem={renderItem}
      header={{
        sortId,
        items: [
          { id: 'name', label: <FormattedMessage id="common.name.label" />, sortable: true },
          {
            id: 'attendanceRate',
            label: <FormattedMessage id="attendance.listItem.header.title" />,
            sortable: true,
          },
        ],
        onSort,
        sortOrder,
      }}
    />
  )
}

type TableContentItem = {
  id: number
  name: string
  attendanceRate?: number
  archived: boolean
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
        archived: s.archived,
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

type SortProps = 'name' | 'attendanceRate'
