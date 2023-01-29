import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  className?: string
}
export const SectionHeader: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <Typography variant="h4" className={className}>
      {children}
    </Typography>
  )
}
