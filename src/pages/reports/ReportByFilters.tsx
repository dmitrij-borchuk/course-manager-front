import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Box from '@mui/material/Box'
import { ReportFilter, getReportPreviewRequest } from 'modules/reports/api'
import { SortOrder } from '../../types/sorting'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Filters } from './reportByFilter/Filters'

// TODO: add filtering
// TODO: resize columns
// TODO: sorting
export function ReportByFiltersTab() {
  const [filters, setFilters] = useState<Filter[]>([])
  const validFilters = filterInvalidFilters(filters)
  const [tableConfig] = useState({ order: 'asc' as SortOrder, orderBy: 'name', page: 0, pageSize: 25 })
  const [data, isFetching] = useReportPreview(useThrottle(validFilters, 500), tableConfig)

  return (
    <Box mt={3}>
      <Box>
        <Filters onFiltersChanged={(f) => setFilters(f)} />
      </Box>
      <Box mt={3}>
        <DataGrid
          loading={isFetching}
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: tableConfig,
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  )
}

function useThrottle<T>(value: T, delay: number) {
  const [throttledValue, setThrottledValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return throttledValue
}

type Filter = {
  id: string
  field: string
  value: string | string[]
  operation: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, hideable: false, sortable: false, filterable: false },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    sortable: false,
    filterable: false,
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    field: 'outerId',
    headerName: 'Outer id',
    width: 300,
    sortable: false,
    filterable: false,
  },
]

function useReportPreview(
  filters: ReportFilter[],
  tableConfig: { order: SortOrder; orderBy: string; page: number; pageSize: number }
) {
  const { data, isFetching } = useQuery(
    ['reportPreview', filters],
    () => {
      return getReportPreviewRequest(
        filters,
        tableConfig.page,
        tableConfig.pageSize,
        tableConfig.order,
        tableConfig.orderBy
      )
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      keepPreviousData: true,
    }
  )
  const parsedData = data?.data ?? []

  return [parsedData, isFetching] as const
}

function filterInvalidFilters(filters: Filter[]): ReportFilter[] {
  return filters.filter((f) => f.field.length > 0 && f.operation.length > 0 && f.value.length > 0)
}
