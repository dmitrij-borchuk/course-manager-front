import React from 'react'
import { FormattedDate } from 'react-intl'
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
        <Text size="25" color="primary">
          {date.getDate()}
        </Text>
        <Text type="body">
          <FormattedDate value={date} weekday="short" />
        </Text>
      </div>
      <div className="flex flex-col w-full">
        {/* TODO: what if no elements */}
        {items.map((item) => (
          <AttendanceMeter key={item.id} text={item.text} progress={item.progress} />
        ))}
      </div>
    </div>
  )
}
