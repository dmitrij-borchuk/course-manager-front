import { usePDF, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { Attendance } from '../../types/attendance'
import { Group } from '../../types/group'
import { SortOrder } from '../../types/sorting'
import { Student } from '../../types/student'

type ReportByGroupProps = {
  group: Group
  attendances: Attendance[]
  students: Student[]
  order: SortOrder
}
export const ReportByGroup = ({ group, attendances, students, order }: ReportByGroupProps) => {
  const attendanceRate = useAttendanceRateByStudent(attendances)
  const attendancesReport = students
    .map((s) => ({
      label: s.name,
      value: attendanceRate[s.id] && attendanceRate[s.id] * 100,
    }))
    .sort((a, b) => (order === 'asc' ? a.value - b.value : b.value - a.value))
  const [instance, updateInstance] = usePDF({
    document: <PDFTemplate title={group.name} groupName={group.name} attendances={attendancesReport} />,
  })
  const date = new Date().toLocaleDateString()

  useEffect(() => {
    // Need to call this callback when data is changed
    // otherwise PDF will not be updated
    updateInstance()
  }, [attendancesReport, group, updateInstance])

  return (
    <>
      {instance.url && (
        <Button
          // @ts-ignore
          href={instance.url}
          node="a"
          waves="light"
          download={`attendance-report-${group.name}-${date}.pdf`}
        >
          <FormattedMessage id="reports.submitButton" />
        </Button>
      )}
    </>
  )
}

type PDFTemplateProps = {
  title: string
  groupName: string
  attendances: {
    label: string
    value: number
  }[]
}
const PDFTemplate = ({ title, groupName, attendances }: PDFTemplateProps) => (
  // TODO: move `creator` and `producer` to the config
  <Document creator="Learnify" producer="Learnify" title={title}>
    <Page size="A4" style={[styles.page, styles.column]}>
      <View style={[styles.header, styles.flex]} fixed>
        <Text>{groupName}</Text>
      </View>
      <View style={[styles.flex, styles.content]}>
        {attendances.map((a, i) => (
          <View key={i} style={[styles.listItem, i % 2 === 1 ? styles.highlighted : styles.empty]}>
            <Text>{a.label}</Text>
            <Text>{Math.round(a.value)}%</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: '24px',
  },
  header: {
    fontSize: '36pt',
  },
  content: {
    marginTop: '24px',
  },
  flex: {
    display: 'flex',
  },
  column: {
    flexDirection: 'column',
  },
  listItem: {
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  highlighted: {
    backgroundColor: '#eee',
  },
  empty: {},
})
