import React from 'react'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { CustomError } from '../../types/error'
import { useOrgId } from '../../hooks/useOrgId'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { useIntl } from 'react-intl'
import { useFormWithError } from '../../hooks/useFormWithError'
import { Input } from '../kit/input/Input'

type ConfirmInvitationForm = {
  name: string
}

interface Props {
  onSubmit: (data: ConfirmInvitationForm) => void
  loading?: boolean
  className?: string
  disabled?: boolean
  error?: CustomError
}
export const ConfirmInvite: React.FC<Props> = ({ className = '', disabled, onSubmit, loading = false, error }) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const { control, handleSubmit, errors } = useFormWithError<ConfirmInvitationForm>(
    {
      defaultValues: {
        name: '',
      },
    },
    error
  )

  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        {/* TODO: use org name */}
        {/* TODO: use translations */}
        {/* TODO: check valid invite */}

        <FormLayout
          header={`You have been invited to organization ${orgId}.`}
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
