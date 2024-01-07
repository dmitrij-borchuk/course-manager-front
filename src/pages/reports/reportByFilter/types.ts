export type Filter<T> = {
  id: string
  field: string
  value: T
  operation: string
}
