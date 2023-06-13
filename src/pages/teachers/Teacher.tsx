import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useTeachersState } from '../../store'
import { TITLE_POSTFIX } from '../../config'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useGroups } from 'store/groupsStore'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  const { filter } = useActivitiesFiltering()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)
  const { fetchTeacher, teachersById, fetching } = useTeachersState()

  const groupsQuery = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
    performerId: id,
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(groupsIds)
  const attendances = attendanceQuery.data || []
  const teacher = teachersById[id]
  const org = useCurrentOrg()
  const rateByGroup = useAttendanceRateByGroups(groups || [], attendances)

  useEffect(() => {
    if (org) {
      fetchTeacher(org.id, id)
      // TODO: clear
    }
  }, [fetchTeacher, id, org])

  // TODO: 404

  return (
    <>
      <Helmet>
        <title>Teacher{TITLE_POSTFIX}</title>
      </Helmet>

      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>
        {teacher && <Teacher data={teacher} attendanceRates={rateByGroup} teachersGroups={groups} />}
      </Loader>
    </>
  )
}
