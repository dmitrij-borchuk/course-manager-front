import MuiBox, { BoxProps as MuiBoxProps } from '@mui/material/Box'
import { forwardRef } from 'react'

export type FlexProps = MuiBoxProps & {
  justifyCenter?: boolean
  alignCenter?: boolean
  column?: boolean
}
export const Flex = forwardRef<unknown, FlexProps>(function Flex(
  { justifyCenter, alignCenter, column, ...props },
  ref
) {
  return (
    <MuiBox
      ref={ref}
      {...props}
      sx={[
        {
          display: 'flex',
          boxSizing: 'border-box',
          justifyContent: justifyCenter ? 'center' : undefined,
          alignItems: alignCenter ? 'center' : undefined,
          flexDirection: column ? 'column' : undefined,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  )
})
