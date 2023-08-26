import React from 'react'
import './styles.css'
import { Box, BoxProps } from '@mui/material'

interface Props {
  value: number // 0 - 1
  BoxProps?: BoxProps
}
export const AttendanceRateBadge = ({ value, BoxProps }: Props) => {
  return (
    <Box
      // TODO: color depends on rate
      className="p-1 rate-bg-alert color-text-light rounded-sm w-10 h-6 text-xs flex-shrink-0 flex justify-center"
      data-testid="attendance-rate-badge"
      {...BoxProps}
    >
      {Math.round(value * 100)}%
    </Box>
  )
}
