import { forwardRef } from 'react'
import MuiBox, { BoxProps as MuiBoxProps } from '@mui/material/Box'

export interface BoxProps extends MuiBoxProps {}
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(props: BoxProps, ref) {
  return <MuiBox {...props} ref={ref} />
})
