import { usePDF } from '@react-pdf/renderer'
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
    students.map((s) => ({
      label: s.name,
      value: attendanceRate[s.outerId] && attendanceRate[s.outerId] * 100,
    }))
  )
    .filter(hasRate)
    .map((r) => {
      const rate = `${Math.round(r.value)}%`

      return {
        label: r.label,
        value: rate,
      }
    })
  const [instance, updateInstance] = usePDF({
    document: <AttendanceReportTemplate title={group.name} heading={group.name} attendances={attendancesReport} />,
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
    </>
  )
}
