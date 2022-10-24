import { Dictionary } from '../types/dictionary'

type Selector<T> = keyof T | ((o: T) => string | number | null | undefined)
function getValue<T>(o: T, selector: Selector<T>) {
  if (typeof selector === 'function') {
    return selector(o)
  }

  return o[selector]
}

export function groupBy<T>(xs: T[], selector: Selector<T>) {
  return xs.reduce(function (rv, x) {
    const value = getValue(x, selector)
    if (typeof value === 'string' || typeof value === 'number') {
      ;(rv[value] = rv[value] || []).push(x)
      return rv
    }
    return rv
  }, {} as Record<string | number, T[]>)
}

export function noop() {}

export function arrayToDictionary<T extends { id: string | number }>(list?: T[]) {
  if (!list) {
    return {}
  }

  return list.reduce<Dictionary<T>>((acc, item) => {
    acc[item.id] = item

    return acc
  }, {})
}

export function getDiff(initial: string[], result: string[]) {
  const added: string[] = []
  const removed: string[] = []
  initial.forEach((item) => {
    if (!result.includes(item)) {
      removed.push(item)
    }
  })
  result.forEach((item) => {
    if (!initial.includes(item)) {
      added.push(item)
    }
  })

  return {
    added,
    removed,
  }
}

const emptyObject = {}
export function getEmptyDictionary<T>() {
  return emptyObject as Dictionary<T>
}
