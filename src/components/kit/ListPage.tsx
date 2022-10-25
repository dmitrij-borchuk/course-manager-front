import React from 'react'
import { Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { ListWithLinks, ListWithLinksProps } from './list/List'

interface Props {
  className?: string
  listHeader?: React.ReactNode
  fabBtnLink?: string
}
export function ListPage<T extends { id: string | number }>({
  className = '',
  listHeader,
  fabBtnLink,
  ...rest
}: Props & ListWithLinksProps<T>) {
  return (
    <div className={className}>
      <Container className="px-4">
        {listHeader && <SectionHeader>{listHeader}</SectionHeader>}

        <ListWithLinks<T> {...rest} />
      </Container>

      {fabBtnLink && (
        <Link to={fabBtnLink} data-testid="fab-btn">
          <FabBtn />
        </Link>
      )}
    </div>
  )
}
