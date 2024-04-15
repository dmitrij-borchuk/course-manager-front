import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-materialize'
import { Link } from 'react-router-dom'
import Icon from '@mui/material/Icon'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle'
import { useTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import { useOrgId } from '../../hooks/useOrgId'
import { Student } from '../../types/student'
import { ROUTES } from '../../constants'
import './styles.css'

interface Props {
  items: Student[]
  groupId: number
  header?: string
  open?: boolean
  loading?: boolean
  onClose?: () => void
  onSubmit: (data: Student[]) => void
  initial?: Student[]
}
export function SelectStudentsDialog(props: Props) {
  const { onSubmit, open = false, header, items, onClose, initial, groupId } = props
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
        <DialogTitle className="flex justify-between">
          {header}
          <AddNewItemBtn group={groupId} />
        </DialogTitle>
        <DialogContent>
          <Autocomplete<Student, true>
            multiple
            autoHighlight
            handleHomeEndKeys
            id="tags-standard"
            options={items}
            getOptionLabel={(option) => option.name}
            value={selected}
            // Workaround to be able to use items with same label
            // filtering doesn't work properly otherwise
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            onChange={(event, value) => setSelected(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{
              width: {
                md: 500,
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  className: `${params.inputProps.className} browser-default`,
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

          <ButtonWithLoader loading={submitting} className="color-alert" onClick={onSubmitClick}>
            <FormattedMessage id="common.dialog.btn.ok" />
          </ButtonWithLoader>
        </DialogActions>
      </Dialog>
    </>
  )
}

function AddNewItemBtn({ group }: { group: number }) {
  const intl = useIntl()
  const orgId = useOrgId()

  return (
    <Tooltip title={intl.formatMessage({ id: 'students.add' })}>
      <Link
        to={`/${orgId}${ROUTES.STUDENTS_ADD}?backUrl=/${orgId}${ROUTES.GROUPS_ROOT}/${group}?action=openStudentsDialog`}
      >
        <IconButton aria-label={intl.formatMessage({ id: 'students.add' })}>
          <Icon>person_add</Icon>
        </IconButton>
      </Link>
    </Tooltip>
  )
}
