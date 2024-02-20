import { Box, Container, Typography } from '@mui/material'
import { fetchActivity } from 'modules/activities/api'
import { fetchParticipant } from 'api/participants'
import { AttendanceDetails } from 'modules/attendance/AttendanceDetails'
import { useQuery } from 'react-query'
import { Spinner } from 'react-materialize'
import { Ellipsis } from 'components/kit/ellipsis/Ellipsis'

type Props = {
  participantId: number
  activityId: number
}
export function DetailsByActivityAndParticipant({ activityId, participantId }: Props) {
  const participantQuery = useQuery(['participant', participantId], () => fetchParticipant(participantId), {
    refetchOnWindowFocus: false,
  })
  const { data: participantResp } = participantQuery
  const participantName = participantResp?.data?.name

  const activityQuery = useQuery(['activity', activityId], () => fetchActivity(activityId), {
    refetchOnWindowFocus: false,
  })
  const { data: activityResp } = activityQuery
  if (!participantResp) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }
  const activityName = activityResp?.data?.name

  return (
    <>
      <Typography variant="h4">
        <Ellipsis>{participantName}</Ellipsis>
      </Typography>
      <Typography variant="h5" color="GrayText">
        <Ellipsis>{activityName}</Ellipsis>
      </Typography>
      <Box mt={3}>
        <AttendanceDetails participant={participantResp.data} activityId={activityId} />
      </Box>
    </>
  )
}
