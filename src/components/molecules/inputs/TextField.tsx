import React from 'react'
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import Collapse from '@mui/material/Collapse'

export type TextFieldProps = MuiTextFieldProps

export const TextField: React.FC<TextFieldProps> = ({ helperText, FormHelperTextProps: helperTextProps, ...props }) => {
  return (
    <MuiTextField
      {...props}
      FormHelperTextProps={{
        ...helperTextProps,
        component: 'div' as React.ElementType,
      }}
      helperText={<Collapse in={Boolean(helperText)}>{helperText}</Collapse>}
      inputProps={{
        ...props.inputProps,
        className: `${props.inputProps?.className} browser-default`,
      }}
    />
  )
}
