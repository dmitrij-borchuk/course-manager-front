import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { Header } from '../kit/header/Header'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { SkeletonList } from '../kit/skeleton/SkeletonList'
import { Text } from '../kit/text/Text'

// TODO: add attendance
interface UserItem {
  id: string
  name?: string
}
interface Props {
  loading?: boolean
  className?: string
  items?: UserItem[]
}
// TODO: probably needs to be deleted
export const UsersList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        <SectionHeader>
          <FormattedMessage id="users.list.title" />
        </SectionHeader>

        <List loading={loading} items={items} />
      </Container>
      <Link to={`/invite`}>
        <FabBtn />
      </Link>
    </div>
  )
}

interface ListProps {
  loading: boolean
  items: UserItem[]
}
const List = ({ loading, items }: ListProps) => {
  if (loading) {
    return <SkeletonList />
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center">
        <Text type="h6" color="textGray">
          <FormattedMessage id="users.list.empty" />
        </Text>
      </div>
    )
  }

  return (
    <Collection>
      {items.map((item) => (
        <CollectionItemLink key={item.id} to={`${ROUTES.USERS_ROOT}/${item.id}`}>
          {item.name || (
            <Text color="textGray">
              <FormattedMessage id="common.unknownName" />
            </Text>
          )}
        </CollectionItemLink>
      ))}
    </Collection>
  )
}
