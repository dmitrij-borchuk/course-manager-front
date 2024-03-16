import { Container } from 'react-materialize'
import { Box } from '@mui/material'
import { AttendanceTimeLine } from '../attendance/AttendanceTimeline'
import { DashboardMenu } from '../dashboardMenu/DashboardMenu'

type AttendanceTimeLineProps = React.ComponentProps<typeof AttendanceTimeLine>

interface Props {
  items?: AttendanceTimeLineProps['items']
}
export const Dashboard: React.FC<Props> = ({ items }) => {
  return (
    <Box display="flex" position="relative">
      <Container className="px-4">
        <AttendanceTimeLine items={items} />
      </Container>

      {/* Fab */}
      <DashboardMenu />
    </Box>
  )
}
