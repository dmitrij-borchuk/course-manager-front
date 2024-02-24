import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { DetailsByActivityAndParticipant } from 'modules/participants'
import { fetchParticipant } from 'api/participants'
import { fetchActivity } from 'modules/activities/api'
import { GeneralPage } from 'components/layouts/GeneralPage'

// TODO: Add 404 state
export const StudentInGroup = () => {
  const params = useParams<{ activityId: string; participantId: string }>()
  const activityId = Number(params.activityId)
  const participantId = Number(params.participantId)

  const participantQuery = useQuery(['participant', participantId], () => fetchParticipant(participantId), {
    refetchOnWindowFocus: false,
  })
  const activityQuery = useQuery(['activity', activityId], () => fetchActivity(activityId), {
    refetchOnWindowFocus: false,
  })
  const participantName = participantQuery.data?.data?.name || ''
  const activityName = activityQuery.data?.data?.name || ''
  return (
    <>
      <GeneralPage title={`${participantName} - ${activityName}`}>
        <DetailsByActivityAndParticipant activityId={activityId} participantId={participantId} />
      </GeneralPage>
    </>
  )
}

export default StudentInGroup
