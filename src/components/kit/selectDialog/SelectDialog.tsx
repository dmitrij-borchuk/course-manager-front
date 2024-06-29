import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ButtonWithLoader } from '../buttons/ButtonWithLoader'
import { TinyPreloader } from '../TinyPreloader/TinyPreloader'
import { List } from '../list/List'

type Accessor<T> = keyof T | ((data: T) => any)

interface PropsBase<T> {
  items: T[]
  header?: string
  open?: boolean
  labelProp: Accessor<T>
  loading?: boolean
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
// TODO: tests
export function SelectDialog<T extends { id: string | number }>(props: PropsMulti<T>): JSX.Element
export function SelectDialog<T extends { id: string | number }>(props: PropsSingle<T>): JSX.Element
export function SelectDialog<T extends { id: string | number }>({
  onSubmit,
  open = false,
  header,
  items,
  loading = false,
  multiSelect,
  labelProp,
  onCloseStart,
  initial,
  ...rest
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

  const onSubmitClick = useCallback(() => {
    submit()
  }, [submit])
  const okBtn = multiSelect ? (
    <ButtonWithLoader loading={submitting} onClick={onSubmitClick}>
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
              <CheckCircleIcon />
            </div>
          )}
        </div>
      )
    },
    [labelProp, onSelect, selected, selectedLoading]
  )
  // TODO: add loading for the !multiSelect
  // TODO: add cursor pinter
  // TODO: use mui

  return (
    <>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <List items={items} loading={loading} renderItem={renderItem} />
        </DialogContent>

        <DialogActions>
          <Button disabled={submitting} onClick={onCloseStart}>
            <FormattedMessage id="common.dialog.btn.cancel" />
          </Button>
          {okBtn}
        </DialogActions>
      </Dialog>
    </>
  )
}
