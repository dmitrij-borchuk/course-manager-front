import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, ModalProps } from 'react-materialize'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Student } from '../../types/student'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import './styles.css'

interface Props {
  items: Student[]
  header?: string
  open?: boolean
  loading?: boolean
  trigger?: ModalProps['trigger']
  onCloseStart?: () => void
  onSubmit: (data: Student[]) => void
  initial?: Student[]
}
export function SelectStudentsDialog(props: Props) {
  const { onSubmit, open, header, items, trigger, onCloseStart, initial } = props
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

  // We need this workaround to make sure that we call last version of `resetSelected` callback
  // `onCloseEnd` is saved in the `Modal` component once at the mount and never changed
  const onCloseEnd = useRef<any>(resetSelected)
  onCloseEnd.current = resetSelected

  const onSubmitClick = useCallback(() => {
    submit()
  }, [submit])
  const okBtn = (
    <ButtonWithLoader loading={submitting} flat node="button" className="color-alert" onClick={onSubmitClick}>
      <FormattedMessage id="common.dialog.btn.ok" />
    </ButtonWithLoader>
  )

  return (
    <Modal
      actions={[
        <Button flat modal="close" disabled={submitting}>
          <FormattedMessage id="common.dialog.btn.cancel" />
        </Button>,
        okBtn,
      ]}
      trigger={trigger}
      open={open}
      bottomSheet={false}
      fixedFooter={false}
      header={header}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%',
        onCloseStart,
        onCloseEnd: () => onCloseEnd.current(),
      }}
      // @ts-ignore
      className="students-select-dialog"
      data-testid="students-select-dialog"
    >
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
    </Modal>
  )
}
