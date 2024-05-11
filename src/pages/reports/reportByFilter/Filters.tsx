import { ReactNode, useState } from 'react'
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'react-materialize'
import { useGroups } from 'store/groupsStore'
import { FilterEditor, ValueInputProps } from '../reportByFilter/FilterEditor'
import { Filter } from './types'

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
  const groupsQuery = useGroups()
  const addFilter = () => {
    const newFilter = filters.concat({ id: Math.random().toString(), field: '', value: '', operation: '' })
    setFilters(newFilter)
    onFiltersChanged(newFilter)
  }
  const updateFilter = (filter: Filter<string | string[]>) => {
    const index = filters.findIndex((f) => f.id === filter.id)
    const newFilters = [...filters]
    const newOperations = fields.find((f) => f.id === filter.field)?.operations
    const hasInvalidOperation = filter.operation !== '' && !newOperations?.find((o) => o.value === filter.operation)
    const fieldUpdated = filter.field !== '' && filter.field !== filters[index].field
    const newFilter = {
      ...filter,
      operation: hasInvalidOperation ? '' : filter.operation,
      value: fieldUpdated ? '' : filter.value,
    }
    newFilters[index] = {
      ...newFilter,
      operation: newOperations?.length === 1 ? newOperations?.[0].value : newFilter.operation,
    }
    setFilters(newFilters)
    onFiltersChanged(newFilters)
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
          value: 'is',
          label: 'Is',
        },
      ],
      Input: useMultiSelectValueInput(
        groupsQuery.data?.data.map((g) => ({
          value: g.id.toString(),
          label: g.name,
        })) ?? []
      ),
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
          <Grid container spacing={2}>
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

function useMultiSelectValueInput(options: MultiSelectValueInputProps['options']) {
  return (props: ValueInputProps) => {
    return <MultiSelectValueInput options={options} {...props} />
  }
}

type MultiSelectValueInputProps = ValueInputProps & {
  options: { value: string; label: ReactNode }[]
}
function MultiSelectValueInput(props: MultiSelectValueInputProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-name-label">
        <FormattedMessage id="reports.valueInput.label" />
      </InputLabel>
      <Select
        multiple
        value={typeof props.value === 'string' ? [] : props.value}
        onChange={(e) => {
          const {
            target: { value },
          } = e
          props.onChange?.(typeof value === 'string' ? value.split(',') : value)
        }}
        input={<OutlinedInput label={<FormattedMessage id="reports.valueInput.label" />} />}
      >
        {props.options.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
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
