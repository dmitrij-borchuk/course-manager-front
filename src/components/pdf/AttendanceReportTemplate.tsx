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
  <Document creator="Checkinizer" producer="Checkinizer" title={title}>
    <Page size="A4" style={[styles.page]}>
      <View style={[styles.header]} fixed>
        <Text>{heading}</Text>
      </View>
      <View style={[styles.flex, styles.content]}>
        {attendances.map((a, i) => (
          <View key={i} style={[styles.listItem, i % 2 === 1 ? styles.highlighted : styles.empty]} wrap={false}>
            <Text style={[styles.listLabel]}>{a.label}</Text>
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
    padding: '24px',
    paddingTop: '72px',
  },
  header: {
    fontSize: '36pt',
    position: 'absolute',
    width: '100%',
    top: '24px',
    left: '24px',
  },
  content: {
    width: '100%',
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
  listLabel: {
    paddingRight: '50px',
  },
})
