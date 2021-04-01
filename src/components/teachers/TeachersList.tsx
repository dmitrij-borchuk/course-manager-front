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
interface Props {
  loading?: boolean
  className?: string
  items?: {
    id: string
    name: string
  }[]
}
export const TeachersList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <div className={className}>
      <Header />

      <Container>
        <SectionHeader>
          <FormattedMessage id="teachers.list.title" />
        </SectionHeader>

        <List loading={loading} items={items} />
      </Container>

      <Link to={ROUTES.TEACHERS_ADD}>
        <FabBtn />
      </Link>
    </div>
  )
}

interface ListProps {
  loading: boolean
  items: {
    id: string
    name: string
  }[]
}
const List = ({ loading, items }: ListProps) => {
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
        <CollectionItemLink key={item.id} to={`${ROUTES.TEACHERS_ROOT}/${item.id}`}>
          {item.name}
        </CollectionItemLink>
      ))}
    </Collection>
  )
}
