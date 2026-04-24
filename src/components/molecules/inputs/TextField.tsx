import React from 'react'
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import Collapse from '@mui/material/Collapse'

export type TextFieldProps = MuiTextFieldProps

export function TextField({ helperText, ...props }: TextFieldProps) {
  return (
    <MuiTextField
      {...props}
      slotProps={{
        formHelperText: {
          ...props.slotProps?.formHelperText,
          component: 'div' as React.ElementType,
        },
        input: {
          ...props.slotProps?.input,
          // TODO: remove it when react-materialize will be removed
          className: ` browser-default`,
        },
      }}
      helperText={<Collapse in={Boolean(helperText)}>{helperText}</Collapse>}
    />
  )
}
