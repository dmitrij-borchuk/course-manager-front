import React, { useCallback, useMemo, useState } from 'react'
import { Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { FilterField } from 'components/inputs/FilterField'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { ListWithLinks, ListWithLinksProps } from './list/List'

interface Props<T> {
  className?: string
  listHeader?: React.ReactNode
  fabBtnLink?: string
  filter?: {
    predicate: (item: T, filterTerm: string) => boolean
  }
}
export function ListPage<T extends { id: string | number }>({
  className = '',
  listHeader,
  fabBtnLink,
  filter,
  items,
  ...rest
}: Props<T> & ListWithLinksProps<T>) {
  const [filterTerm, setFilterTerm] = useState('')
  const filteredItems = useMemo(() => {
    if (!filter) return items
    return items.filter((i) => filter.predicate(i, filterTerm))
  }, [filter, filterTerm, items])
  const onFilter = useCallback((value) => {
    setFilterTerm(value)
  }, [])

  return (
    <div className={className}>
      <Container className="px-4">
        {listHeader && <SectionHeader>{listHeader}</SectionHeader>}

        <Box
          width={{
            xs: '100%',
            sm: '50%',
            md: '30%',
          }}
          ml="auto"
        >
          <FilterField onDebouncedChange={onFilter} />
        </Box>

        <ListWithLinks<T> items={filteredItems} {...rest} />
      </Container>

      {fabBtnLink && (
        <Link to={fabBtnLink} data-testid="fab-btn">
          <FabBtn />
        </Link>
      )}
    </div>
  )
}
