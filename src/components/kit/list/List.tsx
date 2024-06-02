import React, { ComponentProps, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection } from 'react-materialize'
import { CollectionItemLink } from '../collectionItemLink/CollectionItemLink'
import { SkeletonList } from '../skeleton/SkeletonList'
import { Text } from '../text/Text'
import { Ellipsis } from '../ellipsis/Ellipsis'
import { ListHeader } from './ListHeader'

export interface ListProps<T> {
  loading?: boolean
  items: T[]
  emptyListPlaceholder?: React.ReactNode
  renderItem: (data: T) => JSX.Element
  className?: string
  header?: HeaderProps
}
export function List<T>({ loading = false, items, emptyListPlaceholder, renderItem, className, header }: ListProps<T>) {
  if (loading) {
    return <SkeletonList />
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center">
        <Text type="h6" color="textGray" data-testid="empty-list-text">
          {emptyListPlaceholder ? emptyListPlaceholder : <FormattedMessage id="common.list.empty" />}
        </Text>
      </div>
    )
  }

  return (
    <div>
      {header && (
        <div className="mx-5">
          <ListHeader {...header} />
        </div>
      )}
      <Collection className={className}>{items.map(renderItem)}</Collection>
    </div>
  )
}

export type ListWithLinksProps<T> = Omit<ListProps<T>, 'renderItem'> & {
  itemLinkRoot: string
  labelProp: keyof T
  renderItem?: (data: T) => JSX.Element
}
export function ListWithLinks<T extends { id: string | number }>({
  itemLinkRoot,
  labelProp,
  renderItem,
  ...rest
}: ListWithLinksProps<T>) {
  const renderLink = useMemo(
    () => renderLinkItem<T>(labelProp, itemLinkRoot, renderItem),
    [itemLinkRoot, labelProp, renderItem]
  )

  return <List renderItem={renderLink} {...rest} />
}

function renderLinkItem<T extends { id: string | number }>(
  labelProp: keyof T,
  itemLinkRoot: string,
  renderItem?: (data: T) => JSX.Element
) {
  return (data: T) => (
    <CollectionItemLink key={data.id} to={`${itemLinkRoot}/${data.id}`} data-testid="list-link-item">
      {/* @ts-expect-error */}
      <Ellipsis>{renderItem ? renderItem(data) : data[labelProp]}</Ellipsis>
    </CollectionItemLink>
  )
}

type HeaderProps = ComponentProps<typeof ListHeader>
