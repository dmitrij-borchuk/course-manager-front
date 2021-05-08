import { Container } from 'react-materialize'
import { AttendanceTimeLine } from '../attendance/AttendanceTimeline'
import { Header } from '../kit/header/Header'
import { DashboardMenu } from '../dashboardMenu/DashboardMenu'

type AttendanceTimeLineProps = React.ComponentProps<typeof AttendanceTimeLine>

interface Props {
  items?: AttendanceTimeLineProps['items']
  className?: string
}
export const Dashboard: React.FC<Props> = ({ className = '', items }) => {
  return (
    <div className={className}>
      <Header />
      <Container className="px-4">
        <AttendanceTimeLine items={items} />
      </Container>

      {/* Fab */}
      <DashboardMenu />
    </div>
  )
}
