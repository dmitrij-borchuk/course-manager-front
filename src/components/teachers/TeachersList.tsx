import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
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
export const TeachersList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <div className={className}>
      <Header />

      <Container className="px-4">
        <SectionHeader>
          <FormattedMessage id="teachers.list.title" />
        </SectionHeader>

        <List loading={loading} items={items} />
      </Container>

      {/* <Link to={ROUTES.TEACHERS_ADD}>
        <FabBtn />
      </Link> */}
    </div>
  )
}

interface ListProps {
  loading: boolean
  items: UserItem[]
}
const List = ({ loading, items }: ListProps) => {
  const orgId = useOrgId()
  if (loading) {
    return <SkeletonList />
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center">
        <Text type="h6" color="textGray">
          <FormattedMessage id="teachers.list.empty" />
        </Text>
      </div>
    )
  }

  return (
    <Collection>
      {items.map((item) => (
        <CollectionItemLink key={item.id} to={`/${orgId}${ROUTES.TEACHERS_ROOT}/${item.id}`}>
          {item.name || (
            <Text color="textGray" className="my-0">
              <FormattedMessage id="common.unknownName" />
            </Text>
          )}
        </CollectionItemLink>
      ))}
    </Collection>
  )
}
