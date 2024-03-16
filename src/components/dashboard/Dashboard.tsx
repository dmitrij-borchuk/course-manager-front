import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { useOrgId } from 'hooks/useOrgId'
import { SectionHeader } from 'components/kit/sectionHeader/SectionHeader'
import { AddButton } from 'components/inputs/AddButton'
import { AttendanceTimeLine } from '../attendance/AttendanceTimeline'
import { ROUTES } from '../../constants'

type AttendanceTimeLineProps = React.ComponentProps<typeof AttendanceTimeLine>

interface Props {
  items?: AttendanceTimeLineProps['items']
}
export const Dashboard: React.FC<Props> = ({ items }) => {
  const history = useHistory()
  const orgId = useOrgId()
  const onReportClick = useCallback(() => {
    if (orgId) {
      history.push(`/${orgId}${ROUTES.ATTENDANCE_ADD}`)
    }
  }, [history, orgId])

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <SectionHeader>
          <FormattedMessage id="header.nav.dashboard" />
        </SectionHeader>
        <AddButton onClick={onReportClick}>
          <FormattedMessage id="attendance.add.label" />
        </AddButton>
      </Box>
      <AttendanceTimeLine items={items} />
    </Box>
  )
}
