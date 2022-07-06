import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { FormattedMessage } from 'react-intl'
import { useAttendancesState, useGroupsState, useUsersState } from '../../store'
import AttendanceEditor from '../../components/attendance/AttendanceEditor'
import { useOrgId } from '../../hooks/useOrgId'
import useStudentsOfGroupStore from '../../store/studentsOfGroupStore'
import { Group } from '../../types/group'
import { Dictionary } from '../../types/dictionary'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export const AttendanceEditorPage = () => {
  const { id } = useParams<{ id: string }>()
  const { addToast } = useToasts()
  const { fetchGroupsOfTeacher, groupsById, groups, fetching: groupsFetching } = useGroupsState()
  const { fetchOrgUser, usersById } = useUsersState()
  const {
    // TODO: optimize
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    studentsOfGroup,
    fetching: studentsFetching,
  } = useStudentsOfGroupStore()
  const history = useHistory()
  const orgId = useOrgId()
  const {
    saveAttendance,
    fetchAttendance,
    attendancesById,
    loading: attendancesLoading,
    removeAttendance,
  } = useAttendancesState()
  // TODO: add 404
  const [group, setGroup] = useState<Group>()
  const onGroupChanged = useCallback(
    (id: string) => {
      setGroup(groupsById[id])
    },
    [groupsById]
  )
  const [date, setDate] = useState<Date>()
  const onDateChanged = useCallback((date: Date) => {
    setDate(date)
  }, [])
  const onDelete = useCallback(async () => {
    await removeAttendance(orgId, id)
    history.replace(`/${orgId}`)
  }, [history, id, orgId, removeAttendance])
  const attendance = attendancesById[id]
  const { organizationUser } = useCurrentUser()
  const attendanceTeacher = attendance && usersById[attendance?.teacher]
  const onSubmit = useCallback(
    async (data: { date: Date; group: string; selected: Dictionary<boolean> }) => {
      if (!organizationUser) {
        return
      }
      try {
        const dataToSave = {
          date: data.date.getTime(),
          attended: data.selected,
          group: data.group,
        }
        if (attendance?.id) {
          // Edit
          await saveAttendance(orgId, {
            id: attendance?.id,
            teacher: attendance.teacher,
            ...dataToSave,
          })
        } else {
          // Create
          await saveAttendance(orgId, { ...dataToSave, teacher: organizationUser.id })
        }

        addToast(<FormattedMessage id="attendance.edit.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
        history.push(`/${orgId}`)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, attendance, history, orgId, organizationUser, saveAttendance]
  )

  useEffect(() => {
    if (id && !attendance) {
      return
    }
    // TODO: cleanup
    if (!organizationUser) {
      return
    }
    const attendanceTeacher = attendance?.teacher
    fetchGroupsOfTeacher(orgId, attendanceTeacher || organizationUser.id)
  }, [attendance, fetchGroupsOfTeacher, id, orgId, organizationUser])

  useEffect(() => {
    if (!attendance) {
      return
    }
    // TODO: cleanup
    fetchOrgUser(orgId, attendance.teacher)
  }, [attendance, fetchOrgUser, orgId])

  const fetchAttendanceById = useCallback(
    async (id: string) => {
      // TODO: cleanup
      try {
        await fetchAttendance(orgId, id)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, fetchAttendance, orgId]
  )
  useEffect(() => {
    if (id) {
      fetchAttendanceById(id)
    }
  }, [fetchAttendanceById, id])

  useEffect(() => {
    if (group?.id) {
      fetchStudentsOfGroup(orgId, group.id, date)
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, date, fetchStudentsOfGroup, group?.id, orgId])

  if (groupsFetching || attendancesLoading) {
    // TODO
    return <div>Loading</div>
  }

  return (
    <AttendanceEditor
      currentGroup={group}
      groups={groups}
      onSubmit={onSubmit}
      attendance={attendance}
      students={studentsOfGroup}
      studentsLoading={studentsFetching}
      onGroupChanged={onGroupChanged}
      onDateChanged={onDateChanged}
      teacher={attendanceTeacher}
      onDelete={onDelete}
    />
  )
}

export default AttendanceEditorPage
