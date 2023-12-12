import { BlobProvider, usePDF } from '@react-pdf/renderer'
import { useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { Activity } from '../../types/activity'
import { Attendance } from '../../types/attendance'
import { SortOrder } from '../../types/sorting'
import { Student } from '../../types/student'
import { AttendanceReportTemplate } from '../pdf/AttendanceReportTemplate'
import { hasRate, sortAttendanceReport } from './utils'

type ReportByGroupProps = {
  group: Activity
  attendances: Attendance[]
  students: Student[]
  order: SortOrder
  loading: boolean
  from: Date
  to: Date
}
export const ReportByGroup = ({ group, attendances, students, order, loading, from, to }: ReportByGroupProps) => {
  const attendancesOfGroup = useMemo(() => {
    return attendances.filter((a) => a.group === group.outerId)
  }, [attendances, group.outerId])
  const attendanceRate = useAttendanceRateByStudent(attendancesOfGroup)
  const attendancesReport = sortAttendanceReport(
    order,
    students.map((s) => {
      const r = attendanceRate[s.outerId]
      const rate = r && Math.round((r.attended / r.total) * 100)
      return {
        label: s.name,
        value: r && `${rate}% (${r.attended}/${r.total})`,
        rate,
      }
    })
  ).filter(hasRate)
  const document = <AttendanceReportTemplate title={group.name} heading={group.name} attendances={attendancesReport} />
  const [instance, updateInstance] = usePDF({
    document,
  })
  const date = new Date().toLocaleDateString()

  useEffect(() => {
    // Need to call this callback when data is changed
    // otherwise PDF will not be updated
    updateInstance()
  }, [attendancesReport, group, from, to, updateInstance])

  return (
    <>
      {instance.url && (
        <Button
          // @ts-ignore
          href={instance.url}
          node="a"
          waves="light"
          download={`attendance-report-${group.name}-${date}.pdf`}
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
    </>
  )
}
