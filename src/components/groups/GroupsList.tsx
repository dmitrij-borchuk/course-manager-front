import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListPage } from '../kit/ListPage'

interface Props {
  loading?: boolean
  className?: string
  items?: Group[]
  attendanceRates?: Dictionary<number>
}
export const GroupsList: React.FC<Props> = ({ className = '', loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const renderItem = useCallback(
    (g: Group) => {
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

  return (
    <ListPage
      className={className}
      items={items}
      loading={loading}
      fabBtnLink={`/${orgId}${ROUTES.GROUPS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.GROUPS_ROOT}`}
      listHeader={<FormattedMessage id="groups.list.title" />}
      labelProp="name"
      renderItem={renderItem}
    />
  )
}
