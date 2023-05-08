import React, { useCallback, useMemo } from 'react'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useSortingByHeader } from 'utils/sorting'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { OrganizationUser } from '../../types/user'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListPage } from '../kit/ListPage'
import { Text } from '../kit/text/Text'

interface Props {
  loading?: boolean
  className?: string
  items?: OrganizationUser[]
  attendanceRates?: Dictionary<number>
}
export const TeachersList: React.FC<Props> = ({ className = '', loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const preparedData: TableContentItem[] = useMemo(() => {
    return items.map((s) => ({
      id: s.id,
      name: s.name,
      outerId: s.outerId,
      role: s.role,
      attendanceRate: attendanceRates ? attendanceRates[s.outerId] : null,
    }))
  }, [items, attendanceRates])
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
        <Box display="flex" gap={2}>
          <Text type="body" color="textGray" className="m-0">
            {d.role}
          </Text>
          {d.attendanceRate && <AttendanceRateBadge value={d.attendanceRate} />}
        </Box>
      </div>
    )
  }, [])
  const getData = useCallback((d: TableContentItem, prop: keyof TableContentItem) => d[prop], [])
  const { onSort, sortId, sortOrder, sortedItems } = useSortingByHeader<TableContentItem>(preparedData, {
    defaultSortId: 'name',
    getData,
  })

  return (
    <ListPage
      className={className}
      items={sortedItems}
      loading={loading}
      // fabBtnLink={`/${orgId}${ROUTES.GROUPS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.TEACHERS_ROOT}`}
      listHeader={<FormattedMessage id="teachers.list.title" />}
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
        predicate: usersFilteringPredicate,
      }}
    />
  )
}

function usersFilteringPredicate(item: TableContentItem, filterTerm: string) {
  return item.name ? item.name.toLowerCase().includes(filterTerm.toLowerCase()) : false
}

type TableContentItem = {
  id: number
  name: string | undefined
  attendanceRate: number | null
  outerId: string
  role: string | undefined
}
