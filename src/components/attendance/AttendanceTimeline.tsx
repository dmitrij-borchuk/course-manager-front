import React from 'react'
import { Divider } from 'react-materialize'
import { AttendanceDateBlock } from './AttendanceDateBlock'

interface Props {
  items?: {
    date: Date
    items: { id: string; text: string; progress: number }[]
  }[]
  className?: string
}
export const AttendanceTimeLine: React.FC<Props> = ({ className = '', items = [] }) => {
  return (
    <div className={`${className} space-y-6 mt-3`}>
      {/* TODO: what if no items */}
      {items.map((item) => (
        <div>
          <AttendanceDateBlock className="w-full" date={item.date} items={item.items} />
          <div className="mt-3 absolute left-0 w-full">
            <Divider />
          </div>
        </div>
      ))}
    </div>
  )
}
