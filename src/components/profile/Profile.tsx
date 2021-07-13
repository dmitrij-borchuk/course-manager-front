import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { Organization } from '../../types/organization'
import { Header } from '../kit/header/Header'
import { Text } from '../kit/text/Text'

// TODO: add loading

interface Props {
  className?: string
  organizations?: Organization[]
}
export const Profile = (props: Props) => {
  const { className, organizations = [] } = props

  return (
    <div className={className}>
      <Header />
      <Container>
        <Text type="h4">
          <FormattedMessage id="profile.organizations.header" />
        </Text>
        {organizations.map((org) => (
          <Link key={org.id} to={`/${org.id}`}>
            {org.name}
          </Link>
        ))}
      </Container>
    </div>
  )
}
