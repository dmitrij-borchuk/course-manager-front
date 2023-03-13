import { useCallback, useMemo, useState } from 'react'

type Options<T> = {
  defaultSortId: keyof T
  getData: (item: T, prop: keyof T) => AvailablePrimitives
}
export function useSortingByHeader<T>(items: T[] = [], { defaultSortId, getData }: Options<T>) {
  const [sortId, setSortId] = useState<keyof T>(defaultSortId)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const onSort = useCallback((newSortId: keyof T, order: SortOrder) => {
    setSortId(newSortId)
    setSortOrder(order)
  }, [])

  const sortedItems: T[] = useMemo(() => {
    const sorted = items.sort((a, b) => {
      const aValue = getData(a, sortId)
      const bValue = getData(b, sortId)

      if (aValue === undefined) {
        return -1
      }
      if (bValue === undefined) {
        return 1
      }

      return compare(aValue, bValue)
    })
    if (sortOrder === 'desc') {
      sorted.reverse()
    }

    return sorted
  }, [getData, items, sortId, sortOrder])

  return {
    sortId,
    sortOrder,
    onSort,
    sortedItems,
  }
}

export type SortOrder = 'asc' | 'desc'

function compare(a: AvailablePrimitives, b: AvailablePrimitives) {
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? -1 : 1
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return 0
}

type AvailablePrimitives = string | number | boolean | undefined | null
