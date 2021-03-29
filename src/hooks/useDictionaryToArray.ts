import { Dictionary } from '../types/dictionary'

export function useDictionaryToArray<T>(data: Dictionary<T>) {
  const array: T[] = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      array.push(data[key])
    }
  }

  return array
}
