import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalProps } from 'react-materialize'
import { ButtonWithLoader } from '../buttons/ButtonWithLoader'
import { List } from '../list/List'
import { TinyPreloader } from '../TinyPreloader/TinyPreloader'

type Accessor<T> = keyof T | ((data: T) => any)

interface PropsSingle<T> {
  items: T[]
  onSubmit: (data: T) => void
  header?: string
  open?: boolean
  labelProp: Accessor<T>
  loading?: boolean
  multiSelect?: false
  trigger?: ModalProps['trigger']
  onCloseStart?: () => void
}
interface PropsMulti<T> extends Omit<PropsSingle<T>, 'multiSelect'> {
  multiSelect: true
}
export function SelectDialog<T>(props: PropsSingle<T>): JSX.Element
export function SelectDialog<T>(props: PropsMulti<T>): JSX.Element
export function SelectDialog<T>({
  onSubmit,
  open,
  header,
  items,
  loading = false,
  multiSelect,
  labelProp,
  trigger,
  onCloseStart,
}: PropsSingle<T> | PropsMulti<T>) {
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState<T[]>([])
  const [selectedLoading, setSelectedLoading] = useState<T>()
  const submit = useCallback(
    async (item?: T) => {
      setSubmitting(true)
      try {
        if (multiSelect) {
          await onSubmit(selected as any)
        } else {
          setSelectedLoading(item)
          await onSubmit(item as any)
        }
      } catch (error) {
        // TODO: error handling
      }
      setSubmitting(false)
    },
    [multiSelect, onSubmit, selected]
  )
  const onSelect = useCallback(
    async (item: T) => {
      if (!multiSelect && !submitting) {
        return submit(item)
      }
      setSelected((items) => {
        const index = items.findIndex((i) => i === item)
        if (index < 0) {
          return [...items, item]
        }

        items.splice(index, 1)

        return items
      })
    },
    [multiSelect, submit, submitting]
  )
  const onCloseEnd = useCallback(() => {
    setSelectedLoading(undefined)
    setSelected([])
  }, [])
  const onSubmitClick = useCallback(() => {
    submit()
  }, [submit])
  const okBtn = multiSelect ? (
    <ButtonWithLoader loading={submitting} flat node="button" className="color-alert" onClick={onSubmitClick}>
      <FormattedMessage id="common.dialog.btn.ok" />
    </ButtonWithLoader>
  ) : null
  const renderItem = useCallback(
    (d) => {
      const label = typeof labelProp === 'function' ? labelProp(d) : d[labelProp]
      return (
        <div className="collection-item flex justify-between" onClick={() => onSelect(d)}>
          {label}
          {selectedLoading === d && <TinyPreloader />}
        </div>
      )
    },
    [labelProp, onSelect, selectedLoading]
  )
  // TODO: add loading for the !multiSelect

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
        onCloseEnd,
      }}
    >
      <List items={items} loading={loading} renderItem={renderItem} />
    </Modal>
  )
}
