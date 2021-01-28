import { Container } from 'react-materialize'
import { AttendanceTimeLine } from '../attendance/AttendanceTimeline'
import { Header } from '../kit/header/Header'

type AttendanceTimeLineProps = React.ComponentProps<typeof AttendanceTimeLine>

interface Props {
  items?: AttendanceTimeLineProps['items']
  className?: string
}
export const Dashboard: React.FC<Props> = ({ className = '', items }) => {
  return (
    <div className={className}>
      <Header />
      <Container>
        <AttendanceTimeLine items={items} />
      </Container>
    </div>
  )
}
