import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { Box, styled } from '@mui/material'
import { useSortingByHeader } from 'utils/sorting'
import { useAccessManager } from 'hooks/useAccessManager'
import { AddButton } from 'components/inputs/AddButton'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Profile } from 'types/profile'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListPage } from '../kit/ListPage'
import { Text } from '../kit/text/Text'

interface Props {
  loading?: boolean
  className?: string
  items?: Profile[]
  attendanceRates?: Dictionary<number>
}
export const TeachersList: React.FC<Props> = ({ className = '', loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const preparedData: TableContentItem[] = useMemo(() => {
    return items.map((s) => ({
      id: s.id,
      name: s.name,
      outerId: s.user.outerId,
      role: s.role,
      attendanceRate: attendanceRates ? attendanceRates[s.user.outerId] : null,
    }))
  }, [items, attendanceRates])
  const history = useHistory()
  const { hasAccess } = useAccessManager()
  const onInviteClick = useCallback(() => {
    if (orgId) {
      history.push(`/${orgId}/invite`)
    }
  }, [history, orgId])
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
          <CapitalizedText type="body" color="textGray" className="m-0">
            {d.role}
          </CapitalizedText>
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
      listHeader={
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormattedMessage id="teachers.list.title" />
          {hasAccess('MANAGE_TEACHERS') && (
            <AddButton onClick={onInviteClick}>
              <FormattedMessage id="users.invite.btn.label" />
            </AddButton>
          )}
        </Box>
      }
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
  if (filterTerm === '') return true
  return item.name ? item.name.toLowerCase().includes(filterTerm.toLowerCase()) : false
}

type TableContentItem = {
  id: number
  name: string | undefined
  attendanceRate: number | null
  outerId: string
  role: string | undefined
}

const CapitalizedText = styled(Text)`
  text-transform: capitalize;
`
