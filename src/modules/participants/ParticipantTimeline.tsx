import { FormattedDate } from 'react-intl'
import { Alert, Box, Card, CardContent, Stack } from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab'
import { AttendanceRateBadge } from 'components/kit/attendanceRateBadge/AttendancerateBadge'
import { ParticipationRecord } from 'modules/activities/api'
import { useStudentAttendanceRateByGroups } from 'hooks/useAttendanceRate'
import { useParticipation } from 'store/groupsStore'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { Activity } from 'types/activity'

interface Props {
  participantId: number
  outerId: string
}
export function ParticipationTimeline({ participantId, outerId }: Props) {
  const participationQuery = useParticipation({
    participantId,
  })
  const groups = participationQuery.data?.data.map((d) => d.activity) || []

  const attendancesQuery = useAttendancesForGroups(groups.map((d) => d.outerId))
  const attendances = attendancesQuery.data || []

  const attendanceRates = useStudentAttendanceRateByGroups(outerId, groups, attendances)
  const timeline = convertToTimeline(participationQuery.data?.data || [])

  return (
    <>
      <Alert severity="warning">The timeline is a prototype!</Alert>

      <Timeline>
        {timeline.map((d, i) => (
          <TimelineItem key={d.activity.id}>
            <TimelineOppositeContent color="textSecondary">
              <FormattedDate value={d.date.toLocaleDateString()} month="short" day="numeric" year="numeric" />
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              {i !== timeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Box display="flex">
                <Card>
                  <CardContent>
                    <Box display="flex">
                      {/* TODO: translation */}
                      {/* TODO: add link to group */}
                      {/* TODO: add link to user */}
                      <Stack>
                        <Box>
                          {d.type === 'assign' ? 'Assigned to' : 'Unassigned from'} {d.activity.name} by{' '}
                          {"{user's name}"}
                        </Box>
                        {d.type === 'unassign' && (
                          <Box display="flex" gap={2}>
                            Reason: {d.reason ? d.reason : <Box color="gray">---</Box>}
                          </Box>
                        )}
                        {(d.type === 'unassign' || d.isActive) && (
                          <Box display="flex">
                            <Box>Attendance rate:</Box>
                            <AttendanceRateBadge
                              value={attendanceRates[d.activity.id] || 0}
                              BoxProps={{
                                ml: 1,
                              }}
                            />
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  )
}

function convertToTimeline(participationRecords: ParticipationRecord[]) {
  const timeline = participationRecords
    .reduce<TimelineDataItem[]>((acc, d, i) => {
      const assign: TimelineDataItem = {
        type: 'assign',
        activity: d.activity,
        date: new Date(d.startDate),
        isActive: !d.endDate,
      }
      if (d.endDate) {
        const unassign: TimelineDataItem = {
          type: 'unassign',
          activity: d.activity,
          date: new Date(d.endDate),
          isActive: false,
          reason: d.leaveReasonComment,
        }
        return [...acc, assign, unassign]
      }
      return [...acc, assign]
    }, [])
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .reverse()

  return timeline
}

type TimelineDataItem = {
  type: 'assign' | 'unassign'
  activity: Activity
  date: Date
  isActive: boolean
  reason?: string
}
