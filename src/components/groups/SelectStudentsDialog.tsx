import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Chip, Icon, Modal, ModalProps } from 'react-materialize'
import { Student } from '../../types/student'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'

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
  const onSelect = useCallback(
    async (name: string) => {
      const indexInItems = items.findIndex((s) => s.name === name)
      if (indexInItems < 0) {
        return
      }

      const index = selected.findIndex((s) => s.name === name)
      if (index < 0) {
        return setSelected([...selected, items[indexInItems]])
      }
      const copy = [...selected]
      copy.splice(index, 1)

      setSelected(copy)
    },
    [items, selected]
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

  const autoComplete = items.reduce<Record<string, string | null>>((acc, item) => {
    return {
      ...acc,
      [item.name]: null,
    }
  }, {})

  const selectedItems = selected.map((item) => ({
    tag: item.name,
  }))

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
    >
      <Chip
        close={false}
        closeIcon={<Icon className="close">close</Icon>}
        options={{
          data: selectedItems,
          placeholder: intl.formatMessage({ id: 'groups.assignStudents.namePlaceholder' }),
          secondaryPlaceholder: intl.formatMessage({ id: 'groups.assignStudents.moreNamePlaceholder' }),
          autocompleteOptions: {
            data: autoComplete,
            limit: Infinity,
            minLength: 2,
          },
          onChipAdd: function noRefCheck(elements, chip) {
            const names = Object.keys(autoComplete)
            const name = elements[0].querySelector('input').value
            if (names.includes(name)) {
              onSelect(name)
              return
            }

            // Unknown name, removing it
            const close = chip.querySelector('.close')
            if (close instanceof HTMLElement) {
              close.click()
            }
          },
          onChipDelete: function (elements, tagElement) {
            const name = tagElement.childNodes[0]
            onSelect(name.textContent || '')
          },
        }}
      />
    </Modal>
  )
}
