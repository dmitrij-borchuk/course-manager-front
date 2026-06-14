import { Controller, FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useRulesToDefaultMessage, getErrorMessage } from '@/libs/forms'
import { Select, type SelectProps } from '@/molecules/inputs'
// import { TooltipNote } from '@/atoms/dataDisplay';

type FormSelectProps<T extends FieldValues> = Omit<SelectProps<T>, 'value' | 'onChange'> & {
  name: Path<T>
  requiredMessage?: boolean
  registerOptions?: RegisterOptions<T, Path<T>>
  toolTipLabel?: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[] | undefined
  onChange?: (value: T, event: React.ChangeEvent<T>) => void
}
/**
 * Wrapper around `Select` that integrates with react-hook-form.
 */
export function FormSelect<T extends FieldValues>({
  name,
  requiredMessage,
  registerOptions,
  fullWidth,
  onChange,
  ...props
}: FormSelectProps<T>) {
  const { required } = props
  const intl = useIntl()
  const { control } = useFormContext<T>()
  const parsedOptions = useRulesToDefaultMessage(registerOptions)
  const rules = {
    ...parsedOptions,
    ...(required
      ? {
          required: requiredMessage ?? intl.formatMessage({ id: 'forms.fieldIsRequired' }),
        }
      : {}),
  }

  return (
    <Controller<T>
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange: onChangeForm, ...field }, fieldState: { error } }) => {
        return (
          <Select
            {...props}
            fullWidth={fullWidth}
            required={required}
            error={!!error}
            helperText={getErrorMessage(error)}
            onChange={(event) => {
              onChangeForm(event)
              // @ts-expect-error todo: fix this
              onChange?.(event.target.value, event)
            }}
            {...field}
          />
        )
      }}
    />
  )
}
