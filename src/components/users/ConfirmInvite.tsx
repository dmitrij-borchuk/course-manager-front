import React from 'react'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { useOrgId } from '../../hooks/useOrgId'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'

interface Props {
  onSubmit: () => void
  loading?: boolean
  className?: string
  disabled?: boolean
}
export const ConfirmInvite: React.FC<Props> = ({ className = '', disabled, onSubmit, loading = false }) => {
  const orgId = useOrgId()

  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        {/* TODO: use org name */}
        {/* TODO: use translations */}
        {/* TODO: check valid invite */}
        <SectionHeader>You have been invited to organization {orgId}.</SectionHeader>
        <div className="flex justify-center mt-10">
          <SubmitButton loading={loading} disabled={disabled} onSubmit={onSubmit}>
            Confirm
          </SubmitButton>
        </div>
      </Container>
    </div>
  )
}
