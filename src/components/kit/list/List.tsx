import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection } from 'react-materialize'
import { CollectionItemLink } from '../collectionItemLink/CollectionItemLink'
import { SkeletonList } from '../skeleton/SkeletonList'
import { Text } from '../text/Text'
import { Ellipsis } from '../ellipsis/Ellipsis'

export interface ListProps<T> {
  loading: boolean
  items: T[]
  emptyListPlaceholder?: React.ReactNode
  renderItem: (data: T) => JSX.Element
}
export function List<T>({ loading, items, emptyListPlaceholder, renderItem }: ListProps<T>) {
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

  return <Collection>{items.map(renderItem)}</Collection>
}

export type ListWithLinksProps<T> = Omit<ListProps<T>, 'renderItem'> & {
  itemLinkRoot: string
  labelProp: keyof T
}
export function ListWithLinks<T extends { id: string }>({ itemLinkRoot, labelProp, ...rest }: ListWithLinksProps<T>) {
  const renderLink = useMemo(() => renderLinkItem<T>(labelProp, itemLinkRoot), [itemLinkRoot, labelProp])

  return <List renderItem={renderLink} {...rest} />
}

function renderLinkItem<T extends { id: string }>(labelProp: keyof T, itemLinkRoot: string) {
  return (data: T) => (
    <CollectionItemLink key={data.id} to={`${itemLinkRoot}/${data.id}`}>
      <Ellipsis>{data[labelProp]}</Ellipsis>
    </CollectionItemLink>
  )
}
