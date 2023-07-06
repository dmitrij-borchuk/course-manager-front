import React from 'react'
import { Button } from 'react-materialize'
import { User } from 'firebase/auth'
import { FormattedMessage, useIntl } from 'react-intl'
import { InviteInfo } from 'types/organization'
import { Header } from '../kit/header/Header'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'
import { ROUTES } from '../../constants'
import { Container, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

interface Props {
  onSubmit: (data: { name: string }) => void
  loading?: boolean
  className?: string
  disabled?: boolean
  user: User | null
  inviteInfo: InviteInfo
}
export const ConfirmInvite: React.FC<Props> = ({
  className = '',
  disabled,
  onSubmit,
  loading = false,
  user,
  inviteInfo,
}) => {
  const intl = useIntl()
  const { handleSubmit, control, errors } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  })
  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        <SectionHeader>
          <FormattedMessage
            id="users.invite.message"
            values={{
              organizationName: inviteInfo.organization.name,
              userName: inviteInfo.invite.updatedBy.name,
            }}
          />
        </SectionHeader>
        {!user ? (
          <div className="text-center">
            <Text>
              <FormattedMessage id="users.invite.confirmation.needLogin" />
            </Text>
            <Button
              // @ts-ignore
              href={ROUTES.LOGIN}
              node="a"
            >
              <FormattedMessage id="users.invite.confirmation.loginLink" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center flex-col">
              <div className="flex justify-center mt-10 w-80">
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: {
                      value: true,
                      message: intl.formatMessage({ id: 'common.form.required' }),
                    },
                  }}
                  render={(renderProps, state) => (
                    <TextField
                      label={<FormattedMessage id="common.name.label" />}
                      inputProps={{
                        className: `browser-default`,
                      }}
                      fullWidth
                      autoFocus
                      error={state.invalid}
                      helperText={errors.name?.message}
                      {...renderProps}
                    />
                  )}
                />
              </div>
              <div className="flex justify-end mt-2 w-80">
                <SubmitButton loading={loading} disabled={disabled}>
                  Confirm
                </SubmitButton>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  )
}
