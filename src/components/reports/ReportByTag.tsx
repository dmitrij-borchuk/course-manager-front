import { BlobProvider, usePDF } from '@react-pdf/renderer'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { TableDataTemplate } from 'components/pdf/TableDataTemplate'

type Props = {
  tags: string[]
  reportRecords: ReportRecord[]
}
export const ReportByTag = ({ tags, reportRecords }: Props) => {
  const attendancesReport = reportRecords.map((r) => {
    const rate = `${Math.round(r.rate * 100)}%`

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
          width: 70,
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
          >
            <FormattedMessage id="reports.submitButton" />
          </Button>
        )}
        <BlobProvider document={document}>
          {({ url }) => (
            // @ts-ignore
            <a href={url} target="_blank" rel="noreferrer" className="self-center">
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
  rate: number
  activity: string
}
