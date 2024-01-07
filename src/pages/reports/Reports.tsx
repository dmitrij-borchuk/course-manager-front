import { FormattedMessage, useIntl } from 'react-intl'
import { Container, Tab, Tabs } from 'react-materialize'
import { Helmet } from 'react-helmet'
import { SectionHeader } from '../../components/kit/sectionHeader/SectionHeader'
import { ReportByFiltersTab } from './ReportByFilters'
import { ReportByGroupTab } from './ReportByGroupTab'
import { ReportByTagTab } from './ReportByTagTab'
import './styles.css'
import { TITLE_POSTFIX } from '../../config'

export const Reports = () => {
  const intl = useIntl()

  return (
    <div className="report-page-wrapper flex flex-col">
      <Helmet>
        <title>Reports{TITLE_POSTFIX}</title>
      </Helmet>

      <Container className="px-4">
        <SectionHeader>
          <FormattedMessage id="reports.header" />
        </SectionHeader>

        <Tabs className="">
          <Tab title={intl.formatMessage({ id: 'reports.tabs.byTag' })} idx="tags">
            <ReportByTagTab />
          </Tab>

          <Tab title={intl.formatMessage({ id: 'reports.tabs.byGroup' })} idx="group">
            <ReportByGroupTab />
          </Tab>

          <Tab title={intl.formatMessage({ id: 'reports.tabs.byFilters' })} idx="filters">
            <ReportByFiltersTab />
          </Tab>
        </Tabs>
      </Container>
    </div>
  )
}

export default Reports
