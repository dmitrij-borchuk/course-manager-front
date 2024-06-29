import React from 'react'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

type DatePickerProps = {
  defaultValue?: Date
  value?: Date
  disabled?: boolean
  label?: React.ReactNode
  loading?: boolean
  name?: string
  onChange?: (date: Date | null) => void
  fullWidth?: boolean
}
export function DatePicker({ defaultValue, value, onChange, fullWidth, ...props }: DatePickerProps) {
  return (
    <MuiDatePicker
      closeOnSelect
      defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
      value={value ? dayjs(value) : undefined}
      onChange={(date) => onChange?.(date?.toDate() ?? null)}
      slotProps={{
        textField: {
          variant: 'standard',
          fullWidth,
          inputProps: {
            // TODO: remove when materialize-css will be replaced
            className: `browser-default`,
          },
        },
      }}
      {...props}
    />
  )
}
