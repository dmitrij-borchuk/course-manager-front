import { ReactNode, useId } from 'react'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

export type SelectProps<T> = MuiSelectProps<T> & {
  id?: string
  labelId?: string
  label?: ReactNode
  options?: SelectOption[]
  helperText?: ReactNode
}

export function Select<T>({ id, labelId, label, options, helperText, ...props }: SelectProps<T>) {
  const generatedId = useId()
  const generatedLabelId = useId()
  const internalId = id ?? generatedId
  const internalLabelId = labelId ?? generatedLabelId
  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id={internalLabelId}>{label}</InputLabel>
      <MuiSelect labelId={internalLabelId} id={internalId} label={label} {...props}>
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

export type SelectOption = {
  value: string
  label: ReactNode
}
