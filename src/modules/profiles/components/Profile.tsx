import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Box, CircularProgress, Grid, Paper, Typography, styled } from '@mui/material'
import { Profile } from 'types/profile'
import { Organization } from 'types/organization'
import { fetchActivities } from 'modules/activities/api'

type Props = {
  profile: Profile
  organization: Organization
}
export function ProfileView({ profile, organization }: Props) {
  return (
    <>
      <div>
        <Typography variant="h4">{profile.name}</Typography>
        <Typography variant="subtitle1">
          {profile.role} at {organization.name}
        </Typography>

        <Box mt={2} display="flex" gap={2} flexDirection="column">
          <Typography variant="h5">Your Groups</Typography>
          <Grid container spacing={2}>
            <ActivitiesList profile={profile} />
          </Grid>
        </Box>

        {/* <p>Update profile to show data according to role</p>
        <p>- Teacher</p>
        <p>- Groups list</p>
        <p>-? Students list</p>

        <p>TODO: Profile icon</p>
        <p>TODO: Move organization selector to separate page</p>
        <p>TODO: save organization to local storage</p>
        <p>TODO: attendance rate</p>
        <p>TODO: number of students</p>

        <pre>
          id deleted name role updatedAt createdAt organizationId userId updatedBy user{'{'}
          id email outerId
          {'}'}
        </pre> */}
      </div>
    </>
  )
}

type ActivitiesListProps = {
  profile: Profile
}
export function ActivitiesList({ profile }: ActivitiesListProps) {
  const { data, isLoading } = useActivitiesOfUser(profile.userId)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100} width="100%">
        <CircularProgress />
      </Box>
    )
  }

  if (data?.data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100} width="100%">
        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
          Looks like you don't have groups assigned
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {data?.data.map((activity) => (
        <Grid item xs={12} md={6} lg={4} key={activity.id}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <Link to={`groups/${activity.id}`}>{activity.name}</Link>
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
              <Typography variant="h6">Teacher</Typography>
              <Performer variant="body1" title={profile.name}>
                <Link to={`teachers/${profile.id}`}>{profile.name}</Link>
              </Performer>
            </Box>
          </Paper>
        </Grid>
      ))}
    </>
  )
}

function useActivitiesOfUser(id: number) {
  return useQuery(['activities', id], () =>
    fetchActivities({
      performerId: id,
    })
  )
}

const Performer = styled(Typography)`
  max-width: 100%;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
`
