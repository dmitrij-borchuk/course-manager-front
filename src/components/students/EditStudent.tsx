import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'

export type StudentForm = {
  name: string
  description?: string
}

interface Props {
  onSubmit: (data: StudentForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: StudentForm
  error?: ExternalError<StudentForm>
}
export const EditStudent: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
  const intl = useIntl()
  const { control, handleSubmit, errors, setValue } = useFormWithError<StudentForm>(
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
      <Container className="px-4">
        <FormLayout
          header={isEdit ? <FormattedMessage id="students.edit.title" /> : <FormattedMessage id="students.add.title" />}
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
