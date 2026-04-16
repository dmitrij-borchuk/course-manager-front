import { ReactNode, useCallback } from 'react'
import { noop } from '../../../utils/common'
import { Text } from '../text/Text'
import { SortButton } from '@/components/molecules/inputs'

export const ListHeader = (props: {
  items: HeaderItem[]
  onSort?: (id: any, order: SortOrder) => void
  sortOrder?: SortOrder
  sortId?: string
}) => {
  const { items, sortId, onSort = noop, sortOrder } = props
  const onSortInternal = useCallback(
    (newSortId: string) => {
      if (sortId === newSortId) {
        onSort(newSortId, sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        onSort(newSortId, 'asc')
      }
    },
    [onSort, sortId, sortOrder]
  )

  return (
    <div className="flex justify-between">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => item.sortable && onSortInternal(item.id)}
          className={`flex items-center ${item.sortable ? 'cursor-pointer' : ''}`}
        >
          <Text size="12">{item.label}</Text>
          {/* {item.id === sortId && ( */}
          <SortButton order={item.id !== sortId ? undefined : sortOrder} />
          {/* )} */}
        </div>
      ))}
    </div>
  )
}

type HeaderItem = {
  id: string
  label: ReactNode
  sortable?: boolean
}

type SortOrder = 'asc' | 'desc'
