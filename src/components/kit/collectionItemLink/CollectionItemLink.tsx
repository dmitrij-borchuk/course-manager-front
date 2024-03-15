import { Box, useTheme } from '@mui/material'
import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const CollectionItemLink: React.FC<LinkProps> = ({ children, className, ...props }) => {
  const theme = useTheme()
  return (
    <Link className={`collection-item ${className}`} {...props}>
      <Box color={theme.palette.text.primary}>{children}</Box>
    </Link>
  )
}
