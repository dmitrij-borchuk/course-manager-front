import { TextInput, TextInputProps } from 'react-materialize'
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form'

type InputProps = TextInputProps & {
  control: Control<any>
  name: string
  defaultValue?: any
  rules?: RegisterOptions<FieldValues, string>
}
/**
 *
 * @deprecated This component is deprecated. Please use `FormTextField` instead, which is based on MUI and has better support for validation and error handling.
 */
export function Input({ control, name, defaultValue, rules, error, success, ...props }: InputProps) {
  const validationClass = error ? 'invalid' : success ? 'valid' : ''

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <TextInput inputClassName={validationClass} error={error} success={success} {...props} {...field} />
      )}
    />
  )
}
