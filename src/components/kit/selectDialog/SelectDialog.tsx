import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, Modal, ModalProps } from 'react-materialize'
import { ButtonWithLoader } from '../buttons/ButtonWithLoader'
import { List } from '../list/List'
import { TinyPreloader } from '../TinyPreloader/TinyPreloader'

type Accessor<T> = keyof T | ((data: T) => any)

interface PropsBase<T> {
  items: T[]
  header?: string
  open?: boolean
  labelProp: Accessor<T>
  loading?: boolean
  trigger?: ModalProps['trigger']
  onCloseStart?: () => void
}
interface PropsSingle<T> extends PropsBase<T> {
  multiSelect?: false
  onSubmit: (data: T) => void
  initial?: T
}
interface PropsMulti<T> extends PropsBase<T> {
  multiSelect: true
  onSubmit: (data: T[]) => void
  initial?: T[]
}
export function SelectDialog<T extends { id: string }>(props: PropsMulti<T>): JSX.Element
export function SelectDialog<T extends { id: string }>(props: PropsSingle<T>): JSX.Element
export function SelectDialog<T extends { id: string }>({
  onSubmit,
  open,
  header,
  items,
  loading = false,
  multiSelect,
  labelProp,
  trigger,
  onCloseStart,
  initial,
}: PropsSingle<T> | PropsMulti<T>) {
  const [submitting, setSubmitting] = useState(false)
  const initialArray = useMemo(() => {
    if (!initial) {
      return []
    }
    return Array.isArray(initial) ? initial : [initial]
  }, [initial])
  const [selected, setSelected] = useState<T[]>(initialArray)
  const [selectedLoading, setSelectedLoading] = useState<T>()
  useEffect(() => {
    setSelected(initialArray)
  }, [initialArray])
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
      const index = selected.findIndex((s) => s.id === item.id)
      if (index < 0) {
        return setSelected([...selected, item])
      }
      const copy = [...selected]
      copy.splice(index, 1)

      setSelected(copy)
    },
    [multiSelect, selected, submit, submitting]
  )
  const resetSelected = useCallback(() => {
    setSelectedLoading(undefined)
    setSelected(initialArray)
  }, [initialArray])

  // We need this workaround to make sure that we call last version of `resetSelected` callback
  // `onCloseEnd` is saved in the `Modal` component once at the mount and never changed
  const onCloseEnd = useRef<any>(resetSelected)
  onCloseEnd.current = resetSelected

  const onSubmitClick = useCallback(() => {
    submit()
  }, [submit])
  const okBtn = multiSelect ? (
    <ButtonWithLoader loading={submitting} flat node="button" className="color-alert" onClick={onSubmitClick}>
      <FormattedMessage id="common.dialog.btn.ok" />
    </ButtonWithLoader>
  ) : null
  const renderItem = useCallback(
    (d: T) => {
      const label = typeof labelProp === 'function' ? labelProp(d) : d[labelProp]
      const isSelected = !!selected.find((s) => s.id === d.id)

      return (
        <div key={d.id} className="collection-item flex justify-between" onClick={() => onSelect(d)}>
          <div className="overflow-ellipsis overflow-hidden">{label}</div>
          {selectedLoading === d && <TinyPreloader />}
          {isSelected && (
            <div className="ml-2 flex h-5">
              <Icon center>check_circle</Icon>
            </div>
          )}
        </div>
      )
    },
    [labelProp, onSelect, selected, selectedLoading]
  )
  // TODO: add loading for the !multiSelect
  // TODO: add cursor pinter

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
      <List items={items} loading={loading} renderItem={renderItem} />
    </Modal>
  )
}
