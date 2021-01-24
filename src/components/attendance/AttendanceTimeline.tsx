import React from 'react'
import { Divider } from 'react-materialize'
import { AttendanceDateBlock } from './AttendanceDateBlock'

export const AttendanceTimeLine = () => {
  const date = new Date()
  const oneDay = 1000 * 60 * 60 * 24
  const dates = [
    date,
    new Date(date.getTime() + oneDay * 1),
    new Date(date.getTime() + oneDay * 2),
    new Date(date.getTime() + oneDay * 3),
  ]

  return (
    <div className="space-y-6 mt-3">
      {dates.map((date) => (
        <div>
          <AttendanceDateBlock className="w-full" date={date} />
          <div className="mt-3 absolute left-0 w-full">
            <Divider />
          </div>
        </div>
      ))}
    </div>
  )
}
