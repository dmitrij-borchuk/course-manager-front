import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'

export type GroupForm = {
  name: string
}

interface Props {
  onSubmit: (data: GroupForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: GroupForm
  error?: ExternalError<GroupForm>
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
        name: '',
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
        </FormLayout>
      </Container>
    </div>
  )
}
