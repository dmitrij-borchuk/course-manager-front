import React from 'react'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { CustomError } from '../../types/error'
import { useOrgId } from '../../hooks/useOrgId'
import { Text } from '../kit/text/Text'

export type TeacherFormOutput = {
  name: string
  username: string
  email: string
  password: string
  description?: string
}

interface Props {
  onSubmit: () => void
  loading?: boolean
  className?: string
  error?: CustomError
}
export const ConfirmInvite: React.FC<Props> = ({ className = '', onSubmit, loading = false }) => {
  const orgId = useOrgId()

  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        {/* TODO: use org name */}
        {/* TODO: use translations */}
        {/* TODO: check valid invite */}
        <Text type="h4">You have been invited to organization {orgId}.</Text>
        <div className="flex justify-center">
          <SubmitButton loading={loading} onSubmit={onSubmit}>
            Confirm
          </SubmitButton>
        </div>
      </Container>
    </div>
  )
}
