import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { noop, useDebounceFn } from 'utils/common'

type Props = {
  onChange?: (value: string) => void
  onDebouncedChange?: (value: string) => void
}
export function FilterField({ onChange, onDebouncedChange = noop }: Props) {
  const [filterTerm, setFilterTerm] = useState('')
  const onDebouncedChangeCallback = useDebounceFn(onDebouncedChange, 300)
  const onFilter = useCallback(
    (e) => {
      setFilterTerm(e.target.value)
      onChange?.(e.target.value)
      onDebouncedChangeCallback(e.target.value)
    },
    [onChange, onDebouncedChangeCallback]
  )
  const clearFilter = useCallback(
    (e) => {
      setFilterTerm('')
      onChange?.('')
      onDebouncedChangeCallback('')
    },
    [onChange, onDebouncedChangeCallback]
  )

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel htmlFor="filterInput">
        <FormattedMessage id="common.filter" />
      </InputLabel>
      <Input
        id="filterInput"
        onChange={onFilter}
        inputProps={{
          className: `browser-default`,
        }}
        fullWidth
        value={filterTerm}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="clear filter" onClick={clearFilter} edge="end">
              {filterTerm.length > 0 && <ClearIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
