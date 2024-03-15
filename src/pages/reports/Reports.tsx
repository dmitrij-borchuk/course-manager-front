import { FormattedMessage } from 'react-intl'
import React from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import Tooltip from '@mui/material/Tooltip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { SectionHeader } from '../../components/kit/sectionHeader/SectionHeader'
import { ReportByFiltersTab } from './ReportByFilters'
import { ReportByGroupTab } from './ReportByGroupTab'
import { ReportByTagTab } from './ReportByTagTab'
import './styles.css'
import { styled } from '@mui/material'

export const Reports = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className="report-page-wrapper flex flex-col">
      <SectionHeader>
        <FormattedMessage id="reports.header" />
      </SectionHeader>

      <Tabs value={value} onChange={handleChange} aria-label="report tabs">
        <WideTab label={<FormattedMessage id="reports.tabs.byTag" />} {...a11yProps(0)} />
        <WideTab label={<FormattedMessage id="reports.tabs.byGroup" />} {...a11yProps(1)} />
        <WideTab
          label={
            <Box display="flex" alignItems="center" gap={2}>
              <FormattedMessage id="reports.tabs.byFilters" />
              <Tooltip title={<FormattedMessage id="reports.tabs.byFilters.iconTitle" />}>
                <ScienceIcon />
              </Tooltip>
            </Box>
          }
          {...a11yProps(2)}
        />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <ReportByTagTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ReportByGroupTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReportByFiltersTab />
      </CustomTabPanel>
    </div>
  )
}

export default Reports

function a11yProps(index: number) {
  return {
    id: `report-tab-${index}`,
    'aria-controls': `report-tabpanel-${index}`,
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`filter-tab-${index}`}
      aria-labelledby={`filter-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

const WideTab = styled(Tab)`
  width: 140px;
  // To fix redundant background color from Materialize-css
  &:focus {
    background-color: transparent !important;
  }
`
