import { useState } from 'react'
import { Button, Divider, Grid, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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
  const [filters, setFilters] = useState<Filter<string | string[]>[]>([
    { id: Math.random().toString(), field: '', value: '', operation: '' },
  ])
  const addFilter = () => {
    const newFilter = filters.concat({ id: Math.random().toString(), field: '', value: '', operation: '' })
    setFilters(newFilter)
    onFiltersChanged(newFilter)
  }
  const updateFilter = (filter: Filter<string | string[]>) => {
    const index = filters.findIndex((f) => f.id === filter.id)
    const newFilter = [...filters]
    newFilter[index] = filter
    setFilters(newFilter)
    onFiltersChanged(newFilter)
  }
  const removeFilter = (filter: Filter<string | string[]>) => {
    const newFilter = filters.filter((f) => f.id !== filter.id)
    if (newFilter.length === 0) {
      newFilter.push({ id: Math.random().toString(), field: '', value: '', operation: '' })
    }
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
      <Paper sx={{ px: 2, pt: 2 }}>
        <Typography variant="subtitle2">Date range:</Typography>
        <DateRange onRageChanged={onRageChanged} range={range} />
      </Paper>

      <Paper sx={{ p: 2, pt: 1, mt: 2 }}>
        <Typography variant="subtitle2">Filters:</Typography>

        <Box mt={1}>
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
                  onRemove={(f) => removeFilter(f)}
                  value={f}
                />
              </Box>
            ))}
          </Stack>
        </Box>
        <Box mt={2} mr={5}>
          <Grid container spacing={2} xs={12}>
            <Grid item xs={12} sm={4}>
              <Tooltip title={<FormattedMessage id="reports.addFilterBtn.label" />}>
                <Button fullWidth variant="outlined" onClick={() => addFilter()} size="large">
                  <AddIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Paper>
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
