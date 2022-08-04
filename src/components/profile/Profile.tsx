import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Container, Preloader } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Organization } from '../../types/organization'
import { User } from '../../types/user'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { Header } from '../kit/header/Header'
import { List } from '../kit/list/List'
import { Loader } from '../kit/loader/Loader'
import { Text } from '../kit/text/Text'

// TODO: add loading

interface Props {
  className?: string
  organizations?: Organization[]
  user?: User
  organizationsLoading?: boolean
}
export const Profile = (props: Props) => {
  const { className, organizations = [], user, organizationsLoading = false } = props

  if (!user) {
    return <Loader />
  }
  return (
    <div className={className}>
      <Header />
      <Container className="px-4 pb-6">
        <div className="flex w-full justify-between items-center -mt-5">
          <div className="min-w-0">
            {user.name ? (
              <Text type="h3" className="truncate">
                {user.name}
              </Text>
            ) : (
              <Text type="h3" color="textGray" className="truncate">
                <FormattedMessage id="profile.user.noName" />
              </Text>
            )}
          </div>
          {/* TODO: add this for the profile editing */}
          {/* <div className="mt-3">
            <IconButton type="square" size={40} icon="edit" />
          </div> */}
        </div>
        <Text type="h6" color="textGray" className="-mt-2 truncate">
          {user.email}
        </Text>
        <Text type="h5" color="primary">
          <FormattedMessage id="profile.organizations.header" />
        </Text>
        <OrganizationList items={organizations} loading={organizationsLoading} />

        <Link to={ROUTES.ORGANIZATIONS_ADD}>
          <FabBtn />
        </Link>
      </Container>
    </div>
  )
}

type OrganizationListProps = {
  loading: boolean
  items: Organization[]
}
const OrganizationList = (props: OrganizationListProps) => {
  const { items, loading } = props
  const renderItem = useCallback((o: Organization) => {
    return (
      <CollectionItemLink to={`/${o.key}`} data-testid="list-link-item">
        <div className="flex justify-between">
          <Ellipsis>{o.name}</Ellipsis>
          <Text type="body" color="textGray" className="m-0">
            {o.role}
          </Text>
        </div>
      </CollectionItemLink>
    )
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center">
        <Preloader color="red" flashing={false} size="medium" />
      </div>
    )
  }

  return <List items={items} loading={loading} renderItem={renderItem} />
}
