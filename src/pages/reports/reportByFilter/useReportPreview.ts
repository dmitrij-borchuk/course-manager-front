import { AxiosError } from 'axios'
import { useQuery } from 'react-query'
import { SortOrder } from 'utils/sorting'
import { useNotification } from 'hooks/useNotification'
import { ReportFilter, getReportPreviewRequest } from 'modules/reports/api'

export function useReportPreview(
  filters: ReportFilter[],
  tableConfig: { order: SortOrder; orderBy: string; page: number; pageSize: number },
  range: { from: Date; to: Date }
) {
  const { showError } = useNotification()
  const { data, isFetching } = useQuery(
    [
      'reportPreview',
      filters,
      tableConfig.order,
      tableConfig.orderBy,
      tableConfig.page,
      tableConfig.pageSize,
      range.from,
      range.to,
    ],
    async () => {
      const res = await getReportPreviewRequest(
        filters,
        tableConfig.page,
        tableConfig.pageSize,
        tableConfig.order,
        tableConfig.orderBy,
        range.from,
        range.to
      )
      return {
        ...res.data,
        data: res.data.data.map((d) => ({ ...d, id: `${d.id}-${d.activityId}` })),
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      keepPreviousData: true,
      onError: (error: AxiosError<{ message: string }>) => {
        showError(error?.response?.data.message ?? 'Unexpected Error')
      },
    }
  )
  const parsedData = data ?? {
    data: [],
    total: 0,
  }

  return [parsedData, isFetching] as const
}
