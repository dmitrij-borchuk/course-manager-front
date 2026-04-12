import { useEffect } from 'react'
import { FieldPath, FieldValues, useForm, UseFormProps } from 'react-hook-form'

type ExternalFieldError<T extends FieldValues> = {
  field: FieldPath<T>
  message: string
}
export type ExternalError<T extends FieldValues> = {
  fields: ExternalFieldError<T>[]
}
export function useFormWithError<TFieldValues extends FieldValues = FieldValues, TContext = object>(
  options: UseFormProps<TFieldValues, TContext>,
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
