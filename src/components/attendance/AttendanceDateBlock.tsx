import React from 'react'
import { FormattedDate } from 'react-intl'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Text } from '../kit/text/Text'
import { AttendanceMeter } from './AttendanceMeter'

interface Props {
  date: Date
  items?: { id: string; text: string; progress: number }[]
  className?: string
}
export const AttendanceDateBlock: React.FC<Props> = ({ date, items = [], className }) => {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-col items-center mr-3 w-8">
        <Text size="25" color="primary" className="m-0">
          {date.getDate()}
        </Text>
        <Text type="body" className="m-0">
          <FormattedDate value={date} weekday="short" />
        </Text>
      </div>
      <div className="flex flex-col w-full min-w-0 gap-1">
        {/* TODO: what if no elements */}
        {items.map((item) => (
          <Link to={`${ROUTES.ATTENDANCE_EDIT}/${item.id}/${date.toISOString()}`}>
            <AttendanceMeter key={item.id} text={item.text} progress={item.progress} />
          </Link>
        ))}
      </div>
    </div>
  )
}
