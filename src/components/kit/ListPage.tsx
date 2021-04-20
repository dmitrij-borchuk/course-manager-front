import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { SkeletonList } from '../kit/skeleton/SkeletonList'
import { Text } from '../kit/text/Text'
import { Ellipsis } from './ellipsis/Ellipsis'

interface Props {
  className?: string
  listHeader?: React.ReactNode
  fabBtnLink?: string
}
export const ListPage: React.FC<Props & ListProps> = ({ className = '', listHeader, fabBtnLink, ...rest }) => {
  return (
    <div className={className}>
      <Container>
        {listHeader && <SectionHeader>{listHeader}</SectionHeader>}

        <List {...rest} />
      </Container>

      {fabBtnLink && (
        <Link to={fabBtnLink}>
          <FabBtn />
        </Link>
      )}
    </div>
  )
}

interface ListProps {
  loading: boolean
  items: {
    id: string
    name: string
  }[]
  emptyListPlaceholder?: React.ReactNode
  itemLinkRoot?: string
}
const List = ({ loading, items, emptyListPlaceholder, itemLinkRoot }: ListProps) => {
  if (loading) {
    return <SkeletonList />
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center">
        <Text type="h6" color="textGray">
          {emptyListPlaceholder ? emptyListPlaceholder : <FormattedMessage id="common.list.empty" />}
        </Text>
      </div>
    )
  }

  return (
    <Collection>
      {items.map((item) => (
        <CollectionItemLink key={item.id} to={`${itemLinkRoot}/${item.id}`}>
          <Ellipsis>{item.name}</Ellipsis>
        </CollectionItemLink>
      ))}
    </Collection>
  )
}
