import { FieldErrors, FieldValues } from 'react-hook-form'

export function getErrorMessage<T extends FieldValues>(error?: FieldErrors<T>[string]): string {
  if (!error) {
    return ''
  }
  const message = error.message

  if (typeof message === 'string') {
    return message
  }

  return ''
}
