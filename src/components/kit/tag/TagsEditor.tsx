import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@/molecules/inputs'

interface Props {
  loading?: boolean
  disabled?: boolean
  error?: string
  value?: string[]
  onUpdate?: (value: string[]) => void
  inputClassName?: string
}
// TODO: fix it, tags are not saved
export const TagsEditor = ({ disabled, loading, error, value = emptyArray, onUpdate, inputClassName }: Props) => {
  const intl = useIntl()
  const [selected, setSelected] = useState<string[]>(value)
  useEffect(() => {
    onUpdate && onUpdate(selected)
  }, [onUpdate, selected])

  return (
    <div>
      <div className="mt-6 row">
        <Autocomplete<string, true, false, true>
          multiple
          freeSolo
          selectOnFocus
          autoSelect
          autoHighlight
          id="tags-standard"
          options={[]}
          value={selected}
          onChange={(event, value) => setSelected(value)}
          sx={{
            minHeight: '55px',
          }}
          disabled={disabled || loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<FormattedMessage id="common.form.tags.label" />}
              placeholder={intl.formatMessage({ id: 'common.form.newTag.label' })}
              error={!!error}
              helperText={error}
            />
          )}
        />
      </div>
    </div>
  )
}

const emptyArray: string[] = []
