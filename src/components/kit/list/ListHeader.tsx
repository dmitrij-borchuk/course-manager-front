import { ReactNode, useCallback } from 'react'
import { noop } from '../../../utils/common'
import { IconButton } from '../buttons/IconButton'
import { Text } from '../text/Text'

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
          <IconButton
            icon="arrow_drop_down"
            className={`transition-all transform ${sortOrder === 'asc' ? '' : 'rotate-180'} ${
              item.id === sortId ? '' : 'scale-0'
            }`}
            style={{ width: item.id !== sortId ? '0px' : '36px' }}
          />
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
