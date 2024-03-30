import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Box } from '@mui/material'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { Loader } from '../../components/kit/loader/Loader'
import { ROLES } from '../../config'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceGrouping } from '../../services/attendances'
import { useAttendancesState, useGroupsState } from '../../store'
import { GeneralPage } from 'components/layouts/GeneralPage'
import { useGroups } from 'store/groupsStore'

export function DashboardPage() {
  const org = useCurrentOrg()
  const { organizationUser } = useCurrentUser()

  if (!org || !organizationUser) {
    return (
      <>
        <GeneralPage title="Dashboard">
          <Loader />
        </GeneralPage>
      </>
    )
  }

  return (
    <>
      <GeneralPage title="Dashboard">
        <DashboardContent />
      </GeneralPage>
    </>
  )
}

export function DashboardContent() {
  const { loadMore, timelineData, loading } = useAttendance()

  return (
    <>
      <Box display="flex" height="calc(100% - 64px)" flexDirection="column">
        <Dashboard items={timelineData} loading={loading} onLoadMore={loadMore} />
      </Box>
    </>
  )
}

function useAttendance() {
  const { addToast } = useToasts()
  const orgKey = useOrgId()
  const now = useMemo(() => Date.now(), [])
  const { organizationUser, loading: userLoading } = useCurrentUser()
  const toDate = useMemo(() => new Date(now - oneDay * 0), [now])
  const [fromDate, setFromDate] = useState(new Date(toDate.getTime() - oneDay * 6))
  const [lastLoadDate, setLastLoadDate] = useState(toDate)
  const {
    fetchAttendancesByDate,
    fetchAttendancesForTeacher,
    attendances,
    clearAttendances,
    loading: loadingAttendances,
  } = useAttendancesState()
  const { fetching: fetchingGroups } = useGroupsState()
  const org = useCurrentOrg()
  const role = org?.role
  const groupsQuery = useGroups(
    {
      performerId: role === ROLES.Administrator ? undefined : organizationUser?.id,
      excludeOldParticipants: true,
    },
    { refetchOnWindowFocus: false }
  )
  const groups = groupsQuery.data?.data
  const isLoading = loadingAttendances || fetchingGroups || userLoading
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)

  const fetchAttendances = useCallback(
    async (fromDate: Date, toDate: Date) => {
      if (!org || !organizationUser) {
        return
      }

      try {
        if (org.role === ROLES.Administrator) {
          await fetchAttendancesByDate(orgKey, fromDate, toDate)
        } else {
          await fetchAttendancesForTeacher(orgKey, organizationUser.outerId, fromDate, toDate)
        }
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, fetchAttendancesByDate, fetchAttendancesForTeacher, org, orgKey, organizationUser]
  )
  const loadMore = useCallback(() => {
    if (isLoading) {
      return
    }

    setLastLoadDate(fromDate)
    setFromDate(new Date(fromDate.getTime() - oneDay * 6))
  }, [fromDate, isLoading])

  useEffect(() => {
    fetchAttendances(fromDate, lastLoadDate)
  }, [clearAttendances, fetchAttendances, fromDate, lastLoadDate])

  return { loadMore, timelineData, loading: isLoading }
}

const oneDay = 1000 * 60 * 60 * 24
