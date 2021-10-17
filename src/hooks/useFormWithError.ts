import { useEffect } from 'react'
import { FieldName, FieldValues, useForm, UseFormOptions } from 'react-hook-form'

type ExternalFieldError<T> = {
  field: FieldName<T>
  message: string
}
export type ExternalError<T> = {
  fields: ExternalFieldError<T>[]
}
export function useFormWithError<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormOptions<TFieldValues, TContext>,
  error?: ExternalError<TFieldValues>
) {
  const { setError, ...result } = useForm<TFieldValues, TContext>(options)

  useEffect(() => {
    if (!error?.fields) {
      return
    }
    error.fields.forEach((error) => {
      setError(error.field, {
        message: error.message,
        shouldFocus: true,
      })
    })
  }, [error?.fields, setError])

  return { ...result, setError }
}
