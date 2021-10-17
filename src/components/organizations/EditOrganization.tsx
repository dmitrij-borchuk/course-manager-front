import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'

export type OrganizationForm = {
  id: string
  name: string
}

interface Props {
  onSubmit: (data: OrganizationForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: OrganizationForm
  error?: ExternalError<OrganizationForm>
}
export const EditOrganization: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
  const intl = useIntl()
  const { control, handleSubmit, errors, setValue } = useFormWithError<OrganizationForm>(
    {
      defaultValues: {
        id: '',
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
          header={
            isEdit ? (
              <FormattedMessage id="organizations.edit.title" />
            ) : (
              <FormattedMessage id="organizations.add.title" />
            )
          }
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="id"
            control={control}
            name="id"
            label={`${intl.formatMessage({ id: 'common.form.id.label' })} *`}
            rules={{ required: true }}
            disabled={loading || disabled}
            error={errors['id']?.message}
          />
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
