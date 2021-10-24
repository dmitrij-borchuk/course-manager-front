import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
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
  const renderItem = useCallback(
    (d: OrganizationUser) => {
      const attendanceRate = attendanceRates ? attendanceRates[d.id] : null
      return (
        <div className="flex justify-between">
          <Ellipsis>
            {d.name || (
              <Text color="textGray" className="my-0">
                <FormattedMessage id="common.unknownName" />
              </Text>
            )}
          </Ellipsis>
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
      // fabBtnLink={`/${orgId}${ROUTES.GROUPS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.TEACHERS_ROOT}`}
      listHeader={<FormattedMessage id="teachers.list.title" />}
      labelProp="name"
      renderItem={renderItem}
    />
  )
}
