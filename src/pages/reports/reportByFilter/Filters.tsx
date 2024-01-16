import { useState } from 'react'
import { Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { FilterEditor, ValueInputProps } from '../reportByFilter/FilterEditor'
import { Filter } from './types'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'react-materialize'

type FiltersProps = {
  onFiltersChanged: (filters: Filter<string | string[]>[]) => void
  onRageChanged: (value: { from: Date; to: Date }) => void
  range: { from: Date; to: Date }
}

// TODO: save filters between refreshes
// TODO: collapsible filters
// TODO: tags selector
// TODO: add groups to the list
// TODO: add empty message
export function Filters(props: FiltersProps) {
  const { onFiltersChanged, onRageChanged, range } = props
  const [filters, setFilters] = useState<Filter<string | string[]>[]>([])
  const addFilter = () => {
    const newFilter = filters.concat({ id: Math.random().toString(), field: '', value: '', operation: '' })
    setFilters(newFilter)
    onFiltersChanged(newFilter)
  }
  const updateFilter = (filter: Filter<string | string[]>) => {
    const newFilter = filters.filter((f) => f.id !== filter.id).concat(filter)
    setFilters(newFilter)
    onFiltersChanged(newFilter)
  }
  const intl = useIntl()
  const fields = [
    {
      id: 'name',
      label: intl.formatMessage({ id: 'common.name.label' }),
      operations: [
        {
          value: 'contains',
          label: 'Contains',
        },
        {
          value: 'startsWith',
          label: 'Starts with',
        },
        {
          value: 'endsWith',
          label: 'Ends with',
        },
      ],
      Input: TextValueInput,
    },
    {
      id: 'tags',
      label: intl.formatMessage({ id: 'common.form.tags.label' }),
      operations: [
        {
          value: 'contains',
          label: 'Contains',
        },
      ],
      Input: TextValueInput,
    },
    {
      id: 'group',
      label: intl.formatMessage({ id: 'reports.filter.group.label' }),
      operations: [
        {
          value: 'contains',
          label: 'Contains',
        },
        {
          value: 'startsWith',
          label: 'Starts with',
        },
        {
          value: 'endsWith',
          label: 'Ends with',
        },
      ],
      Input: TextValueInput,
    },
  ]

  return (
    <>
      <DateRange onRageChanged={onRageChanged} range={range} />

      <Box>
        <Button variant="contained" onClick={() => addFilter()}>
          <FormattedMessage id="reports.addFilterBtn.label" />
        </Button>
      </Box>

      <Box mt={2}>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {filters.length === 0 && (
            <Box display="flex" justifyContent="center">
              <Typography>
                <FormattedMessage id="reports.byFilters.emptyFilters" />
              </Typography>
            </Box>
          )}
          {filters.map((f) => (
            <Box key={f.id}>
              <FilterEditor
                fields={fields}
                onChange={(f) => updateFilter(f)}
                onRemove={(f) => setFilters((filters) => filters.filter((filter) => filter.id !== f.id))}
                value={f}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  )
}

function TextValueInput(props: ValueInputProps) {
  return (
    <TextField
      label={<FormattedMessage id="reports.valueInput.label" />}
      fullWidth
      inputProps={{
        className: `browser-default`,
      }}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  )
}

type DateRangeProps = {
  onRageChanged: (value: { from: Date; to: Date }) => void
  range: { from: Date; to: Date }
}
function DateRange(props: DateRangeProps) {
  const { onRageChanged, range } = props
  const { from, to } = range
  const intl = useIntl()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box>
          <DatePicker
            id="dateFrom"
            options={{
              autoClose: true,
              format: 'mmm dd, yyyy',
              defaultDate: from,
              setDefaultDate: true,
              maxDate: new Date(),
            }}
            // @ts-ignore
            label={`${intl.formatMessage({ id: 'common.from' })} *`}
            onChange={(v) => {
              onRageChanged({ from: v, to })
            }}
            s={12}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <DatePicker
            id="dateTo"
            options={{
              autoClose: true,
              format: 'mmm dd, yyyy',
              defaultDate: to,
              setDefaultDate: true,
              maxDate: new Date(),
            }}
            // @ts-ignore
            label={`${intl.formatMessage({ id: 'common.to' })} *`}
            onChange={(d) => {
              onRageChanged({ from, to: new Date(d.getTime() + dayWithoutSecondInMs) })
            }}
            s={12}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

const dayWithoutSecondInMs = 24 * 60 * 60 * 1000 - 60 * 1000
