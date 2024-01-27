import ClearIcon from '@mui/icons-material/Clear'
import Grid from '@mui/material/Unstable_Grid2'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material'
import { noop } from 'utils/common'
import { Filter } from './types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

type Props<T> = {
  value: Filter<T>
  onChange: (filter: Filter<T>) => void
  onRemove: (filter: Filter<T>) => void
  fields: {
    id: string
    label: string
    Input: ValueInput
    operations: {
      value: string
      label: string
    }[]
  }[]
}
export function FilterEditor<T = any>(props: Props<T>) {
  const { onChange = noop, onRemove = noop, value, fields } = props
  const currentField = fields.find((f) => f.id === value.field)
  const operations = currentField?.operations
  const ValueInput = currentField?.Input

  return (
    <Box display="flex" gap={2}>
      <Grid container spacing={2} xs={12}>
        <Grid xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="reports.fieldInput.label" />
            </InputLabel>
            <Select
              defaultValue={value.field}
              label={<FormattedMessage id="reports.fieldInput.label" />}
              onChange={(e) =>
                onChange({
                  ...value,
                  field: e.target.value,
                })
              }
              fullWidth
              inputProps={{
                className: `browser-default`,
              }}
            >
              {fields.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="reports.operationInput.label" />
            </InputLabel>
            <Select
              defaultValue={value.operation}
              label={<FormattedMessage id="reports.operationInput.label" />}
              onChange={(e) =>
                onChange({
                  ...value,
                  operation: e.target.value,
                })
              }
              fullWidth
            >
              {operations?.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={4}>
          {ValueInput && (
            <ValueInput
              value={value.value}
              onChange={(v: T) =>
                onChange({
                  ...value,
                  value: v,
                })
              }
            />
          )}
        </Grid>
        <Grid
          xs={12}
          display={{
            sm: 'none',
          }}
        >
          <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={() => onRemove(value)} fullWidth>
            <FormattedMessage id="common.remove" />
          </Button>
        </Grid>
      </Grid>
      <Box
        display={{
          xs: 'none',
          sm: 'flex',
        }}
        alignItems={'center'}
      >
        <Tooltip title="Remove filter">
          <IconButton aria-label="delete" onClick={() => onRemove(value)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export type ValueInput = React.ComponentType<ValueInputProps>

export type ValueInputProps = { value?: any; onChange?: (value: any) => void }
