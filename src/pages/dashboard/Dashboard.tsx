import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Preloader } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { FabBtn } from '../../components/kit/FabBtn/FabBtn'
import { ROLES } from '../../config'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceGrouping } from '../../services/attendances'
import { useAttendancesState, useGroupsState } from '../../store'

export function DashboardPage() {
  const { loadMore, timelineData, loading } = useAttendance()

  return (
    <div>
      <Dashboard items={timelineData} />
      <div className="flex justify-center pt-7 pb-7">
        {loading && <Preloader color="red" flashing={false} size="medium" />}
        <LazyLoading loadMore={loadMore} />
      </div>

      <FabBtn />
    </div>
  )
}

const LazyLoading = ({ loadMore, children }: { loadMore: () => void; children?: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
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

function useAttendance() {
  const { addToast } = useToasts()
  const orgId = useOrgId()
  const now = useMemo(() => Date.now(), [])
  const { organizationUser, loading: userLoading } = useCurrentUser()
  const toDate = useMemo(() => new Date(now - oneDay * 0), [now])
  const [fromDate, setFromDate] = useState(new Date(toDate.getTime() - oneDay * 6))
  const [lastLoadDate, setLastLoadDate] = useState(toDate)
  const {
    fetchAllAttendances,
    fetchAttendancesForTeacher,
    attendances,
    clearAttendances,
    loading: loadingAttendances,
  } = useAttendancesState()
  const { fetchGroups, fetchGroupsOfTeacher, groups, fetching: fetchingGroups } = useGroupsState()
  const isLoading = loadingAttendances || fetchingGroups || userLoading
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)

  const fetchAttendances = useCallback(
    async (fromDate: Date, toDate: Date) => {
      if (!organizationUser) {
        return
      }

      try {
        if (organizationUser.role === ROLES.Administrator) {
          await fetchAllAttendances(orgId, fromDate, toDate)
        } else {
          await fetchAttendancesForTeacher(orgId, organizationUser.id, fromDate, toDate)
        }
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, fetchAllAttendances, fetchAttendancesForTeacher, orgId, organizationUser]
  )
  const fetchNeededGroups = useCallback(async () => {
    if (!organizationUser) {
      return
    }
    try {
      if (organizationUser.role === ROLES.Administrator) {
        await fetchGroups(orgId)
      } else {
        await fetchGroupsOfTeacher(orgId, organizationUser.id)
      }
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchGroups, fetchGroupsOfTeacher, orgId, organizationUser])
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

  useEffect(() => {
    fetchNeededGroups()
  }, [fetchNeededGroups])

  return { loadMore, timelineData, loading: isLoading }
}

const oneDay = 1000 * 60 * 60 * 24
