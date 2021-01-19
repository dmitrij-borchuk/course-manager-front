import { TextInput, TextInputProps } from 'react-materialize'
import { Controller } from 'react-hook-form'

type ControllerProps = React.ComponentProps<typeof Controller>
type InputProps = TextInputProps & Pick<ControllerProps, 'control' | 'name' | 'defaultValue' | 'rules' | 'onFocus'>
export function Input({ control, name, defaultValue, rules, onFocus, ...props }: InputProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={(renderProps) => <TextInput {...props} {...renderProps} />}
    />
  )
}
