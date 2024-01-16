import { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, styled } from '@mui/material'
import Box from '@mui/material/Box'
import { useDebounce } from 'utils/common'
import { ReportFilter } from 'modules/reports/api'
import { useReportPreview } from './reportByFilter/useReportPreview'
import { Filters } from './reportByFilter/Filters'
import { useReport } from './reportByFilter/useReport'
import { SortOrder } from 'utils/sorting'

// TODO: after edit filter order is changed
// TODO: resize columns
// TODO: sorting
// TODO fix pagination
// TODO: add loader
export function ReportByFiltersTab() {
  const [filters, setFilters] = useState<Filter[]>([])
  const validFilters = useValidFilters(filters)
  const [tableConfig, setTableConfig] = useState({ order: 'asc' as SortOrder, orderBy: 'name', page: 0, pageSize: 25 })
  const [range, setRange] = useState(() => {
    const to = new Date()
    const from = subMonth(to)
    return { from, to }
  })
  const [rows, isFetching] = useReportPreview(useDebounce(validFilters, 500), tableConfig, range)
  const [fetch] = useReport(validFilters, tableConfig, range)

  return (
    <Box mt={3}>
      <Box>
        <Filters onFiltersChanged={(f) => setFilters(f)} onRageChanged={(v) => setRange(v)} range={range} />
      </Box>
      <Box mt={2}>
        <Button variant="contained" onClick={() => fetch()}>
          <FormattedMessage id="reports.byFilters.generateBtn.label" />
        </Button>
      </Box>
      <Box mt={3}>
        <DataGrid
          sx={{ maxHeight: '600px' }}
          loading={isFetching}
          rows={rows.data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: tableConfig,
            },
          }}
          onPaginationModelChange={(model) =>
            setTableConfig({
              ...tableConfig,
              page: model.page,
              pageSize: model.pageSize,
            })
          }
          pageSizeOptions={[5, 25, 50, 100]}
          rowCount={rows.total}
          paginationMode="server"
          paginationModel={{
            page: tableConfig.page,
            pageSize: tableConfig.pageSize,
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  )
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
    field: 'groups',
    renderCell: ({ row }: any) => {
      return <EllipsisCell>{row.activityName}</EllipsisCell>
    },
    headerName: 'Group',
    width: 300,
  },
  {
    field: 'performer',
    renderCell: ({ row }: any) => {
      return <EllipsisCell>{row.performerName}</EllipsisCell>
    },
    headerName: 'Teacher',
    width: 300,
  },
]

function useValidFilters(filters: Filter[]): ReportFilter[] {
  return useMemo(() => {
    return filters.filter((f) => f.field.length > 0 && f.operation.length > 0 && f.value.length > 0)
  }, [filters])
}

const EllipsisCell = styled(Box)`
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`

function subMonth(date: Date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() - 1)
  return newDate
}
