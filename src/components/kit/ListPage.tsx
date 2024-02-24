import React, { useCallback, useMemo, useState } from 'react'
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
      {listHeader && <SectionHeader>{listHeader}</SectionHeader>}

      {filter && <Filter onFilter={onFilter} />}

      <ListWithLinks<T> items={filteredItems} {...rest} />

      {fabBtnLink && (
        <Link to={fabBtnLink} data-testid="fab-btn">
          <FabBtn />
        </Link>
      )}
    </div>
  )
}

type FilterProps = {
  onFilter: (value: string) => void
}
function Filter({ onFilter }: FilterProps) {
  return (
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
  )
}
