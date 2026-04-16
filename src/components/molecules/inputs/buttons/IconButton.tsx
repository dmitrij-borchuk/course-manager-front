import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton'
import React from 'react'

export type IconButtonProps = MuiIconButtonProps & {
  'data-testid'?: string
}
export const IconButton: React.FC<IconButtonProps> = ({ ...rest }) => {
  return <MuiIconButton {...rest} />
}
