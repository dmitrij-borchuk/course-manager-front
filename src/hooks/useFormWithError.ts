import { useEffect } from 'react'
import { FieldValues, useForm, UseFormOptions } from 'react-hook-form'
import { CustomError } from '../types/error'

export function useFormWithError<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormOptions<TFieldValues, TContext>,
  error?: CustomError
) {
  const { setError, ...result } = useForm<TFieldValues, TContext>(options)

  useEffect(() => {
    if (!error?.fields) {
      return
    }
    error.fields.forEach((error) => {
      setError(error.field as any, {
        message: error.message,
        shouldFocus: true,
      })
    })
  }, [error?.fields, setError])

  return { ...result, setError }
}
