import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { fetchActivity } from 'modules/activities/api'
import { useGroupsState, useStudentsOfGroupState } from '../../store'
import { Group } from '../../components/groups/Group'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { ROUTES } from '../../constants'

export const GroupPage = () => {
  let params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const { deleteGroup, closeGroup } = useGroupsState()
  const {
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    // TODO: should use new API
    studentsOfGroup,
    fetching: loadingGroups,
  } = useStudentsOfGroupState()
  const activityQuery = useActivity(id)
  const activity = activityQuery.data
  const attendanceQuery = useAttendancesForGroups(activity ? [activity.outerId] : [])
  const attendances = attendanceQuery.data
  const history = useHistory()
  const onDelete = useCallback(() => {
    deleteGroup(id)

    history.push(`${ROUTES.GROUPS_LIST}`)
  }, [deleteGroup, history, id])
  const onClose = useCallback(async () => {
    await closeGroup(id)
    activityQuery.refetch()
  }, [closeGroup, id, activityQuery])
  const attendanceRate = useAttendanceRateByStudent(attendances || [])
  const onUpdateTeacher = useCallback(() => {
    activityQuery.refetch()
  }, [activityQuery])

  useEffect(() => {
    if (activity?.id) {
      fetchStudentsOfGroup(activity.id, new Date())
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, fetchStudentsOfGroup, activity?.id])

  if (!activity) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return (
    <>
      <Group
        data={activity}
        performer={activity.performer}
        onDelete={onDelete}
        onClose={onClose}
        attendanceRates={attendanceRate}
        studentsOfGroup={studentsOfGroup}
        loadingGroups={loadingGroups}
        onUpdateTeacher={onUpdateTeacher}
      />
    </>
  )
}

export default GroupPage

function useActivity(id: number) {
  return useQuery(['activity', id], async () => {
    return (await fetchActivity(id)).data
  })
}
