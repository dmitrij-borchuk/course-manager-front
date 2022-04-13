import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

type PDFTemplateProps = {
  title: string
  heading: string
  attendances: {
    label: string
    value: string
  }[]
}
export const AttendanceReportTemplate = ({ title, heading, attendances }: PDFTemplateProps) => (
  // TODO: move `creator` and `producer` to the config
  <Document creator="Learnify" producer="Learnify" title={title}>
    <Page size="A4" style={[styles.page, styles.column]}>
      <View style={[styles.header, styles.flex]} fixed>
        <Text>{heading}</Text>
      </View>
      <View style={[styles.flex, styles.content]}>
        {attendances.map((a, i) => (
          <View key={i} style={[styles.listItem, i % 2 === 1 ? styles.highlighted : styles.empty]}>
            <Text>{a.label}</Text>
            <Text>{a.value}</Text>
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
