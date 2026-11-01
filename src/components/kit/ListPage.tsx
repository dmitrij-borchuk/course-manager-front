import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Box } from '@mui/material'
import { FilterField } from 'components/inputs/FilterField'
import { useQuery } from 'hooks/useQuery'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { SectionHeader } from '@/molecules/layout'
import { ListWithLinks, ListWithLinksProps } from './list/List'

interface Props {
  className?: string
  listHeader?: React.ReactNode
  fabBtnLink?: string
  disableFilter?: boolean
}
export function ListPage<T extends { id: string | number }>({
  className = '',
  listHeader,
  fabBtnLink,
  disableFilter = false,
  items,
  ...rest
}: Props & ListWithLinksProps<T>) {
  const query = useQuery()
  const history = useHistory()
  const urlFilter = query.get('filter') ?? ''
  const [filterTerm, setFilterTerm] = useState(urlFilter)

  useEffect(() => {
    setFilterTerm(urlFilter)
  }, [urlFilter])

  const onFilter = useCallback(
    (value: string) => {
      if (value) {
        query.set('filter', value)
      } else {
        query.delete('filter')
      }
      history.replace({
        search: query.toString(),
      })
    },
    [history, query]
  )

  return (
    <div className={className}>
      {listHeader && <SectionHeader>{listHeader}</SectionHeader>}

      {!disableFilter && <Filter value={filterTerm} onChange={setFilterTerm} onFilter={onFilter} />}

      <ListWithLinks<T> items={items} {...rest} />

      {fabBtnLink && (
        <Link to={fabBtnLink} data-testid="fab-btn">
          <FabBtn />
        </Link>
      )}
    </div>
  )
}

type FilterProps = {
  value: string
  onChange: (value: string) => void
  onFilter: (value: string) => void
}
  function Filter({ value, onChange, onFilter }: FilterProps) {
    return (
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: '50%',
            md: '30%',
          },

          ml: 'auto',
        }}
      >
        <FilterField value={value} onChange={onChange} onDebouncedChange={onFilter} />
      </Box>
    )
  }
