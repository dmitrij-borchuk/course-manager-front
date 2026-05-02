// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheMemo<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newFn = ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key)
  }) as T & { clear: () => void }
  newFn.clear = () => cache.clear()
  return newFn
}
