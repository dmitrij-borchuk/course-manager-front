import React from 'react'
import { Button, Container } from 'react-materialize'
import { User } from 'firebase/auth'
import { FormattedMessage } from 'react-intl'
import { InviteInfo } from 'types/organization'
import { Header } from '../kit/header/Header'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'
import { ROUTES } from '../../constants'

interface Props {
  onSubmit: () => void
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
          <div className="flex justify-center mt-10">
            <SubmitButton loading={loading} disabled={disabled} onSubmit={onSubmit}>
              Confirm
            </SubmitButton>
          </div>
        )}
      </Container>
    </div>
  )
}
