import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Box, CircularProgress } from '@mui/material'
import { noop } from 'utils/common'
import { SectionHeader } from '@/components/molecules/layout'
import { AddButton } from 'components/inputs/AddButton'
import { AttendanceTimeLine } from '../attendance/AttendanceTimeline'
import { ROUTES } from '../../constants'

type AttendanceTimeLineProps = React.ComponentProps<typeof AttendanceTimeLine>

interface Props {
  items?: AttendanceTimeLineProps['items']
  loading?: boolean
  onLoadMore?: () => void
}
export const Dashboard: React.FC<Props> = ({ items, loading = false, onLoadMore = noop }) => {
  const history = useHistory()
  const onReportClick = useCallback(() => {
    history.push(`${ROUTES.ATTENDANCE_ADD}`)
  }, [history])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader>
          <FormattedMessage id="header.nav.dashboard" />
        </SectionHeader>
        <AddButton onClick={onReportClick}>
          <FormattedMessage id="attendance.add.label" />
        </AddButton>
      </Box>
      {/* Negative n=margin to push scroll bar to the edge */}
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          mx: '-24px',
          px: '24px',
        }}
      >
        <AttendanceTimeLine items={items} />
        <div className="flex justify-center pt-7 pb-7">
          {loading && <CircularProgress />}
          <LazyLoading loadMore={onLoadMore} />
        </div>
      </Box>
    </Box>
  )
}

const LazyLoading = ({ loadMore, children }: { loadMore: () => void; children?: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      })
    })
    if (containerRef.current) {
      const target = containerRef.current
      observer.observe(target)

      return () => observer.unobserve(target)
    }
  }, [loadMore])

  return <div ref={containerRef}>{children}</div>
}
