import { Controller, FieldValues, Path, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useRulesToDefaultMessage, getErrorMessage } from '@/libs/forms'
import { TextField, TextFieldProps } from '@/molecules/inputs'

export type FormTextFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: Path<T>
  requiredMessage?: boolean
  options?: RegisterOptions<T, Path<T>>
}
/**
 * Wrapper around `TextField` that integrates with react-hook-form.
 */
export function FormTextField<T extends FieldValues>({
  name,
  required,
  requiredMessage,
  options,
  helperText,
  ...props
}: FormTextFieldProps<T>) {
  const intl = useIntl()
  const { control } = useFormContext<T>()
  const parsedOptions = useRulesToDefaultMessage(options)

  return (
    <>
      <Controller
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...props}
            required={required}
            error={!!error}
            helperText={getErrorMessage(error) ? getErrorMessage(error) : helperText}
            {...field}
          />
        )}
        rules={{
          ...parsedOptions,
          ...(required
            ? {
                required: requiredMessage ?? intl.formatMessage({ id: 'common.form.required' }),
              }
            : {}),
        }}
        control={control}
        name={name}
      />
    </>
  )
}
