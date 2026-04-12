import { PropsWithChildren } from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'

type FormProps<T extends FieldValues, C> = PropsWithChildren<{
  formUtils: UseFormReturn<T, C, T>
  onSubmit?: (data: T) => void
}> &
  Omit<React.HTMLProps<HTMLFormElement>, 'onSubmit'>
export function Form<T extends FieldValues, C>({ children, formUtils, onSubmit, ...props }: FormProps<T, C>) {
  return (
    <FormProvider {...formUtils}>
      <form noValidate onSubmit={onSubmit && formUtils.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  )
}
