import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useAttendancesState, useGroupsState, useStudentsOfGroupState, useTeachersState } from '../../store'
import { Group } from '../../components/groups/Group'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { TITLE_POSTFIX } from '../../config'
import { ROUTES } from '../../constants'

export const GroupPage = () => {
  let params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const { fetchGroup, groupsById, deleteGroup } = useGroupsState()
  const { fetchTeacher, teachersById } = useTeachersState()
  const {
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    // TODO: should use new API
    studentsOfGroup,
    fetching: loadingGroups,
  } = useStudentsOfGroupState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const group = groupsById.get(id)
  const teacher = teachersById[group?.performerId || '']
  const history = useHistory()
  const groupFull = useMemo(() => {
    if (!group || (group?.performerId && !teacher)) {
      return undefined
    }

    return {
      ...group,
      teacher,
    }
  }, [group, teacher])
  const orgKey = useOrgId()
  const onDelete = useCallback(() => {
    deleteGroup(id)

    history.push(`/${orgKey}${ROUTES.GROUPS_LIST}`)
  }, [deleteGroup, history, id, orgKey])
  const attendancesOfGroup = useMemo(() => {
    return attendances.filter((a) => a.group === group?.outerId)
  }, [attendances, group?.outerId])
  const attendanceRate = useAttendanceRateByStudent(attendancesOfGroup)
  const org = useCurrentOrg()
  const orgId = org?.id

  useEffect(() => {
    if (orgId) {
      fetchGroup(id)
    }
  }, [fetchGroup, id, orgId])

  useEffect(() => {
    if (group?.performerId && !teacher && org?.id) {
      fetchTeacher(org.id, group.performerId)
    }
  }, [fetchTeacher, group?.performerId, org?.id, teacher])

  useEffect(() => {
    if (group?.id) {
      fetchStudentsOfGroup(group.id, new Date())
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, fetchStudentsOfGroup, group?.id])

  useEffect(() => {
    if (group) {
      fetchAttendancesForGroups(orgKey, [group.outerId])
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, group, orgKey])

  if (!groupFull) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return (
    <>
      <Helmet>
        <title>Group{TITLE_POSTFIX}</title>
      </Helmet>
      <Group
        data={groupFull}
        onDelete={onDelete}
        attendanceRates={attendanceRate}
        studentsOfGroup={studentsOfGroup}
        loadingGroups={loadingGroups}
      />
    </>
  )
}

export default GroupPage
