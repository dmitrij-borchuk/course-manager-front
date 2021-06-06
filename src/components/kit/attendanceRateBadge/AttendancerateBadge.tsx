import React from 'react'
import './styles.css'

interface Props {
  value: number // 0 - 1
}
export const AttendanceRateBadge = ({ value }: Props) => {
  return (
    <div
      // TODO: color depends on rate
      className="p-1 rate-bg-alert color-text-light rounded-sm w-10 h-6 text-xs flex-shrink-0 flex justify-center"
    >
      {Math.round(value * 100)}%
    </div>
  )
}
