import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { InviteForm } from '../../types/invite'

export type TeacherFormOutput = {
  name: string
  username: string
  email: string
  password: string
  description?: string
}

interface Props {
  onSubmit: (data: InviteForm) => void
  loading?: boolean
  disabled?: boolean
  className?: string
  error?: ExternalError<InviteForm>
  onDialogClose?: () => void
}
export const InviteUser: React.FC<Props> = ({ className = '', onSubmit, loading = false, disabled = false, error }) => {
  const intl = useIntl()
  const { control, handleSubmit, errors } = useFormWithError<InviteForm>(
    {
      defaultValues: {
        email: '',
      },
    },
    error
  )

  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        <FormLayout
          header={<FormattedMessage id="users.invite.title" />}
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="email"
            control={control}
            name="email"
            label={`${intl.formatMessage({ id: 'common.form.email.label' })} *`}
            rules={{ required: true }}
            disabled={loading || disabled}
            error={errors['email']?.message}
          />
        </FormLayout>
      </Container>
    </div>
  )
}
