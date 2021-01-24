import React from 'react'
import { FormattedDate } from 'react-intl'
import { Text } from '../kit/text/Text'
import { AttendanceMeter } from './AttendanceMeter'

interface Props {
  date: Date
}
export const AttendanceDateBlock: React.FC<Props> = ({ date }) => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-3 w-8">
        <Text size="25" color="primary">
          {date.getDate()}
        </Text>
        <Text type="body">
          <FormattedDate value={date} weekday="short" />
        </Text>
      </div>
      <div className="flex flex-col w-full">
        <AttendanceMeter text="Group 1" progress={0.3} />
        <AttendanceMeter className="mt-3" text="Group 1" progress={0.5} />
      </div>
    </div>
  )
}
