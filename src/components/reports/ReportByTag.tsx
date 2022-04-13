import { usePDF } from '@react-pdf/renderer'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-materialize'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { Attendance } from '../../types/attendance'
import { SortOrder } from '../../types/sorting'
import { Student } from '../../types/student'
import { AttendanceReportTemplate } from '../pdf/AttendanceReportTemplate'

type ReportByGroupProps = {
  tags: string[]
  attendances: Attendance[]
  students: Student[]
  order: SortOrder
}
export const ReportByTag = ({ tags, attendances, students, order }: ReportByGroupProps) => {
  const intl = useIntl()
  const attendanceRate = useAttendanceRateByStudent(attendances)
  const attendancesReport = students
    .map((s) => ({
      label: s.name,
      value: attendanceRate[s.id] && attendanceRate[s.id] * 100,
    }))
    .sort((a, b) => (order === 'asc' ? a.value - b.value : b.value - a.value))
    .map((r) => {
      const rate =
        typeof r.value === 'number' ? `${Math.round(r.value)}%` : intl.formatMessage({ id: 'reports.noReports' })

      return {
        label: r.label,
        value: rate,
      }
    })
  const tagsStr = tags.join(', ')
  const [instance, updateInstance] = usePDF({
    // TODO: Show message if no records
    document: <AttendanceReportTemplate title={tagsStr} heading={tagsStr} attendances={attendancesReport} />,
  })
  const date = new Date().toLocaleDateString()

  useEffect(() => {
    // Need to call this callback when data is changed
    // otherwise PDF will not be updated
    updateInstance()
  }, [attendancesReport, tagsStr, updateInstance])

  return (
    <>
      {instance.url && (
        <Button
          // @ts-ignore
          href={instance.url}
          node="a"
          waves="light"
          download={`attendance-report-${tags.join('-')}-${date}.pdf`}
        >
          <FormattedMessage id="reports.submitButton" />
        </Button>
      )}
    </>
  )
}
