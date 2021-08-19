import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container, Preloader } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Organization } from '../../types/organization'
import { AppUser } from '../../types/user'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { Header } from '../kit/header/Header'
import { Text } from '../kit/text/Text'

// TODO: add loading

interface Props {
  className?: string
  organizations?: Organization[]
  user: AppUser
  organizationsLoading?: boolean
}
export const Profile = (props: Props) => {
  const { className, organizations = [], user, organizationsLoading = false } = props

  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        {user.name ? (
          <Text type="h3">{user.name}</Text>
        ) : (
          <Text type="h3" color="textGray">
            <FormattedMessage id="profile.user.noName" />
          </Text>
        )}
        <Text type="h5">
          <FormattedMessage id="profile.organizations.header" />
        </Text>
        {/* TODO: avatar */}
        {!organizationsLoading &&
          organizations.map((org) => (
            <div className="mt-4">
              <Link key={org.id} to={`/${org.id}`}>
                {org.name}
              </Link>
            </div>
          ))}
        {organizationsLoading && <Preloader color="red" flashing={false} size="medium" />}

        <Link to={ROUTES.ORGANIZATIONS_ADD}>
          <FabBtn />
        </Link>
      </Container>
    </div>
  )
}
