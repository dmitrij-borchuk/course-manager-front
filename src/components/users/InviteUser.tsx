/* eslint-disable */
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { InviteForm } from '../../types/invite'
import { InviteLinkDialog } from '../auth/InviteLinkDialog'
import { noop } from '../../utils/common'
import { Message } from '../kit/message/Message'

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
  inviteLink?: string
  onDialogClose?: () => void
}
export const InviteUser: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  error,
  inviteLink,
  onDialogClose = noop,
}) => {
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
        <Message type="error" className="p-4">
          Sorry, inviting doesn't work right now. We are working hard to fix the problem 😔
        </Message>

        {/* <FormLayout
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
        </FormLayout> */}
      </Container>

      {inviteLink && <InviteLinkDialog link={inviteLink} onClose={onDialogClose} />}
    </div>
  )
}
/* eslint-enable */
