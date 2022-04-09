export function setItem<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}
export function getItem<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  if (!value) {
    return null
  }
  return JSON.parse(value)
}
