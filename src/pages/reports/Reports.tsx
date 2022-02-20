import { usePDF } from '@react-pdf/renderer'
import { FormattedMessage } from 'react-intl'
import { Button, Container } from 'react-materialize'
import { SectionHeader } from '../../components/kit/sectionHeader/SectionHeader'
import { TestDocument } from '../../components/pdf/PdfRenderer'
import './styles.css'

export const Reports = () => {
  const [instance, updateInstance] = usePDF({ document: <TestDocument /> })
  return (
    <div className="report-page-wrapper flex flex-col">
      <Container className="px-4">
        <SectionHeader>
          <FormattedMessage id="reports.header" />
        </SectionHeader>

        {instance.url && (
          <Button
            // @ts-ignore
            href={instance.url}
            node="a"
            waves="light"
            download="report.pdf"
          >
            <FormattedMessage id="reports.submitButton" />
          </Button>
        )}
      </Container>
    </div>
  )
}

export default Reports
