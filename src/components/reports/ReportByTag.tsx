import { BlobProvider, usePDF } from '@react-pdf/renderer'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { TableDataTemplate } from 'components/pdf/TableDataTemplate'

type Props = {
  tags: string[]
  reportRecords: ReportRecord[]
  loading?: boolean
}
export const ReportByTag = ({ tags, reportRecords, loading = false }: Props) => {
  const attendancesReport = reportRecords.map((r) => {
    const rate = `${Math.round((r.attended / r.total) * 100)}% (${r.attended}/${r.total})`

    return {
      name: r.name,
      rate: rate,
      activity: r.activity,
    }
  })
  const tagsStr = tags.join(', ')
  const document = (
    <TableDataTemplate
      title={tagsStr}
      heading={tagsStr}
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
  const [instance, updateInstance] = usePDF({
    document,
  })
  const date = new Date().toLocaleDateString()

  useEffect(() => {
    // Need to call this callback when data is changed
    // otherwise PDF will not be updated
    updateInstance()
  }, [attendancesReport, tagsStr, updateInstance])

  const name = `attendance-report-${tags.join('-')}-${date}.pdf`

  return (
    <>
      <div className="flex gap-3 align-middle">
        {instance.url && (
          <Button
            // @ts-ignore
            href={instance.url}
            node="a"
            waves="light"
            download={name}
            disabled={loading}
          >
            <FormattedMessage id="reports.submitButton" />
          </Button>
        )}
        <BlobProvider document={document}>
          {({ url }) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/no-redundant-roles
            <a
              href={!loading && url ? url : undefined}
              target="_blank"
              rel="noreferrer"
              className="self-center"
              aria-disabled={loading}
              role="link"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <FormattedMessage id="reports.open" />
            </a>
          )}
        </BlobProvider>
      </div>
    </>
  )
}

type ReportRecord = {
  name: string
  attended: number
  total: number
  activity: string
}
