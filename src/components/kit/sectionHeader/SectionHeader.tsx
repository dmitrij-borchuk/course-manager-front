import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  className?: string
}
export const SectionHeader: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <Typography variant="h5" className={className} fontWeight="bold">
      {children}
    </Typography>
  )
}
