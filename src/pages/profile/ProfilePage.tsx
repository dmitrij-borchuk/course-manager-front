import { useQuery } from 'react-query'
import { GeneralPage } from 'components/layouts/GeneralPage'
import { useCurrentOrg } from 'hooks/useCurrentOrg'
import { getMyProfileRequest } from 'modules/profiles/api'
import { ProfileView } from 'modules/profiles/components/Profile'

export function ProfilePage() {
  const profileQuery = useProfile()
  const profile = profileQuery.data?.data
  const organization = useCurrentOrg()
  return (
    <>
      <GeneralPage title="Profile">
        {profile && organization ? (
          <ProfileView profile={profile} organization={organization} />
        ) : (
          <div>Loading...</div>
        )}
      </GeneralPage>
    </>
  )
}

function useProfile() {
  return useQuery(['myProfile'], () => getMyProfileRequest(), {
    refetchOnWindowFocus: false,
  })
}
