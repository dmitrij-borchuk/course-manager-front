import { pdf } from '@react-pdf/renderer'
import { TableDataTemplate } from 'components/pdf/TableDataTemplate'
import { ReportByFilterServerRecord, ReportFilter, getReportByFilterRequest } from 'modules/reports/api'
import { useQuery } from 'react-query'
import { SortOrder } from 'utils/sorting'

export function useReport(
  filters: ReportFilter[],
  tableConfig: { order: SortOrder; orderBy: string; page: number; pageSize: number },
  range: { from: Date; to: Date }
) {
  const { data, isFetching, refetch } = useQuery(
    [
      'reportByFilter',
      filters,
      tableConfig.order,
      tableConfig.orderBy,
      tableConfig.page,
      tableConfig.pageSize,
      range.from,
      range.to,
    ],
    async () => {
      const report = await getReportByFilterRequest(
        filters,
        tableConfig.page,
        tableConfig.pageSize,
        tableConfig.order,
        tableConfig.orderBy,
        range.from,
        range.to
      )

      await generateReport(report.data)
      return report
    },
    {
      enabled: false,
    }
  )
  const parsedData = data?.data ?? []

  return [parsedData, refetch, isFetching] as const
}
async function generateReport(data: ReportByFilterServerRecord[]) {
  const attendancesReport = data.map((r) => {
    const rateN = r.total === 0 ? 0 : Math.round((r.attended / r.total) * 100)
    const rate = `${rateN}% (${r.attended}/${r.total})`

    return {
      name: r.name,
      rate: rate,
      activity: r.activityName,
    }
  })
  const document = getPdfDocument(attendancesReport)
  const result = pdf(document)
  const blob = await result.toBlob()
  const fileURL = window.URL.createObjectURL(blob)
  window.open(fileURL)
}

function getPdfDocument(
  attendancesReport: {
    name: string
    rate: string
    activity: string
  }[]
) {
  return (
    <TableDataTemplate
      title={'Report'}
      heading={'Report'}
      rows={attendancesReport}
      columns={[
        {
          key: 'name',
          width: '50%',
        },
        {
          key: 'activity',
          width: '50%',
        },
        {
          key: 'rate',
          width: 120,
          align: 'right',
        },
      ]}
    />
  )
}
