import React, { useCallback } from 'react'
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
  const renderItem = useCallback(
    (d: Student) => {
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
          {typeof attendanceRate === 'number' && <AttendanceRateBadge value={attendanceRate} />}
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
      fabBtnLink={`/${orgId}${ROUTES.STUDENTS_ADD}`}
      itemLinkRoot={`/${orgId}${ROUTES.STUDENTS_ROOT}`}
      listHeader={<FormattedMessage id="students.list.title" />}
      labelProp="name"
      renderItem={renderItem}
    />
  )
}
