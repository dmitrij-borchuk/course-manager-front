import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-materialize'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { useTheme } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Student } from '../../types/student'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import './styles.css'

interface Props {
  items: Student[]
  header?: string
  open?: boolean
  loading?: boolean
  onClose?: () => void
  onSubmit: (data: Student[]) => void
  initial?: Student[]
}
export function SelectStudentsDialog(props: Props) {
  const { onSubmit, open = false, header, items, onClose, initial } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const intl = useIntl()
  const [submitting, setSubmitting] = useState(false)
  const initialArray = useMemo(() => {
    if (!initial) {
      return []
    }
    return Array.isArray(initial) ? initial : [initial]
  }, [initial])
  const [selected, setSelected] = useState<Student[]>(initialArray)
  useEffect(() => {
    setSelected(initialArray)
  }, [initialArray])
  const submit = useCallback(
    async (item?: Student) => {
      setSubmitting(true)
      try {
        await onSubmit(selected as any)
      } catch (error) {
        // TODO: error handling
      }
      setSubmitting(false)
    },
    [onSubmit, selected]
  )
  const resetSelected = useCallback(() => {
    setSelected(initialArray)
  }, [initialArray])

  const onSubmitClick = useCallback(() => {
    submit()
  }, [submit])

  useEffect(() => {
    open && resetSelected()
  }, [open, resetSelected])

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        className="students-select-dialog"
        data-testid="students-select-dialog"
      >
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <Autocomplete<Student, true>
            multiple
            autoSelect
            autoHighlight
            id="tags-standard"
            options={items}
            getOptionLabel={(option) => option.name}
            value={selected}
            onChange={(event, value) => setSelected(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  className: 'browser-default',
                }}
                variant="standard"
                label={<FormattedMessage id="groups.assignStudents.namePlaceholder" />}
                placeholder={intl.formatMessage({ id: 'groups.assignStudents.moreNamePlaceholder' })}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button flat disabled={submitting} onClick={onClose}>
            <FormattedMessage id="common.dialog.btn.cancel" />
          </Button>

          <ButtonWithLoader loading={submitting} flat node="button" className="color-alert" onClick={onSubmitClick}>
            <FormattedMessage id="common.dialog.btn.ok" />
          </ButtonWithLoader>
        </DialogActions>
      </Dialog>
    </>
  )
}
