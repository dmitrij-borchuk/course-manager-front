import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'
import { CustomError } from '../../types/error'

export type GroupForm = {
  name: string
  description?: string
}

interface Props {
  onSubmit: (data: GroupForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: GroupForm
  error?: CustomError
}
export const EditGroup: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
  const intl = useIntl()
  const { control, handleSubmit, errors, setValue } = useFormWithError<GroupForm>(
    {
      defaultValues: {
        description: '',
        ...initial,
      },
    },
    error
  )

  useUpdateInitialForm(setValue, initial)

  return (
    <div className={className}>
      <Container>
        <FormLayout
          header={isEdit ? <FormattedMessage id="groups.edit.title" /> : <FormattedMessage id="groups.add.title" />}
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="name"
            control={control}
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })} *`}
            rules={{ required: true }}
            disabled={loading || disabled}
            error={errors['name']?.message}
          />
          {/* TODO: make text area */}
          <Input
            id="description"
            control={control}
            name="description"
            label={intl.formatMessage({ id: 'common.form.description.label' })}
            disabled={loading || disabled}
            error={errors['description']?.message}
          />
        </FormLayout>
      </Container>
    </div>
  )
}