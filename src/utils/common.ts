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
