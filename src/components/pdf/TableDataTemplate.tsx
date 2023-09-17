import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

type PDFTemplateProps = {
  title: string
  heading: string
  rows: Record<string, string | number>[]
  columns: {
    width?: number | string
    key: string
    align?: 'left' | 'right' | 'center' | 'justify'
  }[]
}
export const TableDataTemplate = ({ title, heading, rows, columns }: PDFTemplateProps) => (
  // TODO: move `creator` and `producer` to the config
  <Document creator="Checkinizer" producer="Checkinizer" title={title}>
    <Page size="A4" style={[styles.page]}>
      <View style={[styles.header]} fixed>
        <Text>{heading}</Text>
      </View>
      <View style={[styles.flex, styles.content]}>
        {rows.map((cell, i) => (
          <View key={i} style={[styles.listRaw, i % 2 === 1 ? styles.highlighted : styles.empty]} wrap={false}>
            {columns.map((c) => (
              <View key={c.key} style={{ width: c.width, textAlign: c.align || 'left', paddingRight: '10px' }}>
                <Text style={[styles.listCell]}>{cell[c.key]}</Text>
              </View>
            ))}
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
  listRaw: {
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  listCell: {
    flexGrow: 1,
  },
  highlighted: {
    backgroundColor: '#eee',
  },
  empty: {},
  listLabel: {
    paddingRight: '50px',
  },
})
