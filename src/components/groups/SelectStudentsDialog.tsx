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
import { useStudentsOfGroupState, useStudentsState } from 'store'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import { useOrgId } from '../../hooks/useOrgId'
import { Student } from '../../types/student'
import { ROUTES } from '../../constants'
import './styles.css'

interface Props {
  groupId: number
  header?: string
  open?: boolean
  onClose?: () => void
  onSubmit: (data: Student[]) => void
  initial?: Student[]
}
export function SelectStudentsDialog(props: Props) {
  const { open = false, onClose } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        className="students-select-dialog"
        data-testid="students-select-dialog"
      >
        <DialogInternal {...props} />
      </Dialog>
    </>
  )
}

interface DialogInternalProps {
  groupId: number
  header?: string
  onClose?: () => void
  onSubmit: (data: Student[]) => void
  initial?: Student[]
}
function DialogInternal(props: DialogInternalProps) {
  const { onSubmit, header, onClose, initial, groupId } = props
  const [submitting, setSubmitting] = useState(false)
  const { students, fetchStudents } = useStudentsState()
  const {
    // TODO: should use new API
    studentsOfGroup,
  } = useStudentsOfGroupState()
  const assignedIds = studentsOfGroup?.map((s) => s.id) ?? []
  const notAssignedParticipants = students.filter((student) => !assignedIds.includes(student.id))

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
  const submit = useCallback(async () => {
    setSubmitting(true)
    try {
      await onSubmit(selected as any)
    } catch (error) {
      // TODO: error handling
    }
    setSubmitting(false)
  }, [onSubmit, selected])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return (
    <>
      <DialogTitle className="flex justify-between">
        {header}
        <AddNewItemBtn group={groupId} />
      </DialogTitle>
      <DialogContent>
        <ParticipantsSelector options={notAssignedParticipants} value={selected} onChange={setSelected} />
      </DialogContent>
      <DialogActions>
        <Button flat disabled={submitting} onClick={onClose}>
          <FormattedMessage id="common.dialog.btn.cancel" />
        </Button>

        <ButtonWithLoader loading={submitting} onClick={submit}>
          <FormattedMessage id="common.dialog.btn.ok" />
        </ButtonWithLoader>
      </DialogActions>
    </>
  )
}

interface ParticipantsSelectorProps {
  onChange?: (data: Student[]) => void
  options?: Student[]
  value?: Student[]
}
function ParticipantsSelector(props: ParticipantsSelectorProps) {
  const { onChange, options = [], value } = props
  const intl = useIntl()

  return (
    <>
      <Autocomplete<Student, true>
        multiple
        autoHighlight
        handleHomeEndKeys
        id="tags-standard"
        options={options}
        getOptionLabel={(option) => option.name}
        value={value}
        // Workaround to be able to use items with same label
        // filtering doesn't work properly otherwise
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        onChange={(event, value) => onChange?.(value)}
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
