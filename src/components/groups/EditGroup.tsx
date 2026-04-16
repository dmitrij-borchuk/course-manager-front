import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '@/templates/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'
import { FormTextField } from '../organisms/form'

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
  const form = useFormWithError<GroupForm>(
    {
      defaultValues: {
        name: '',
        ...initial,
      },
    },
    error
  )
  const { setValue } = form

  useUpdateInitialForm(setValue, initial)

  return (
    <div className={className}>
      <Container className="px-4">
        <FormLayout
          header={isEdit ? <FormattedMessage id="groups.edit.title" /> : <FormattedMessage id="groups.add.title" />}
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={onSubmit}
          formUtils={form}
        >
          <FormTextField
            id="name"
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })}`}
            required
            disabled={loading || disabled}
            fullWidth
          />
        </FormLayout>
      </Container>
    </div>
  )
}
