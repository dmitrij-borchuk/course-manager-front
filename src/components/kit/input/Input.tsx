import { TextInput, TextInputProps } from 'react-materialize'
import { Controller } from 'react-hook-form'

type ControllerProps = React.ComponentProps<typeof Controller>
type InputProps = TextInputProps & Pick<ControllerProps, 'control' | 'name' | 'defaultValue' | 'rules' | 'onFocus'>
export function Input({ control, name, defaultValue, rules, onFocus, error, success, ...props }: InputProps) {
  const validationClass = error ? 'invalid' : success ? 'valid' : ''

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={(renderProps) => (
        <TextInput inputClassName={validationClass} error={error} success={success} {...props} {...renderProps} />
      )}
    />
  )
}
