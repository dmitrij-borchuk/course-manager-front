import { useState } from 'react'
import { Button, Divider, Stack, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import { FilterEditor, ValueInputProps } from '../reportByFilter/FilterEditor'
import { Filter } from './types'
import { FormattedMessage, useIntl } from 'react-intl'

type FiltersProps = {
  onFiltersChanged: (filters: Filter<string | string[]>[]) => void
}

// TODO: btn to remove filter
// TODO: save filters between refreshes
// TODO: collapsible filters
// TODO: tags selector
// TODO: add groups to the list
export function Filters(props: FiltersProps) {
  const { onFiltersChanged } = props
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
  ]

  return (
    <>
      <Box>
        <Stack spacing={2} divider={<Divider flexItem />}>
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

      <Box mt={2}>
        <Button variant="contained" onClick={() => addFilter()}>
          <FormattedMessage id="reports.addFilterBtn.label" />
        </Button>
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
