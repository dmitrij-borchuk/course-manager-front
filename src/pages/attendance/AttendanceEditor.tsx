import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { FormattedMessage } from 'react-intl'
import { useAttendancesState, useGroupsState, useUsersState } from '../../store'
import AttendanceEditor from '../../components/attendance/AttendanceEditor'
import { useOrgId } from '../../hooks/useOrgId'
import useStudentsOfGroupStore from '../../store/studentsOfGroupStore'
import { Dictionary } from '../../types/dictionary'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { Activity } from '../../types/activity'

export const AttendanceEditorPage = () => {
  const { id } = useParams<{ id: string }>()
  const { addToast } = useToasts()
  const { fetchGroupsOfTeacher, groups, fetching: groupsFetching } = useGroupsState()
  const { fetchOrgUser, usersByOuterId } = useUsersState()
  const {
    // TODO: optimize
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    studentsOfGroup,
    fetching: studentsFetching,
  } = useStudentsOfGroupStore()
  const history = useHistory()
  const orgKey = useOrgId()
  const org = useCurrentOrg()
  const {
    saveAttendance,
    fetchAttendance,
    attendancesById,
    loading: attendancesLoading,
    removeAttendance,
  } = useAttendancesState()
  // TODO: add 404
  const [group, setGroup] = useState<Activity>()
  const activitiesByOuterId = useMemo(() => {
    return new Map(groups.map((group) => [group.outerId, group]))
  }, [groups])
  const onGroupChanged = useCallback(
    (outerId: string) => {
      setGroup(activitiesByOuterId.get(outerId))
    },
    [activitiesByOuterId]
  )
  const [date, setDate] = useState<Date>()
  const onDateChanged = useCallback((date: Date) => {
    setDate(date)
  }, [])
  const onDelete = useCallback(async () => {
    await removeAttendance(orgKey, id)
    history.replace(`/`)
  }, [history, id, orgKey, removeAttendance])
  const attendance = attendancesById[id]
  const { organizationUser } = useCurrentUser()
  const attendanceTeacher = attendance && usersByOuterId.get(attendance.teacher)
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
          await saveAttendance(orgKey, {
            id: attendance?.id,
            teacher: attendance.teacher,
            ...dataToSave,
          })
        } else {
          // Create
          await saveAttendance(orgKey, { ...dataToSave, teacher: organizationUser.outerId })
        }

        addToast(<FormattedMessage id="attendance.edit.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
        history.push(`/`)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, attendance, history, orgKey, organizationUser, saveAttendance]
  )

  useEffect(() => {
    if (id && !attendance) {
      return
    }
    // TODO: cleanup
    if (!organizationUser) {
      return
    }
    fetchGroupsOfTeacher(attendanceTeacher?.id || organizationUser.id)
  }, [attendance, attendanceTeacher?.id, fetchGroupsOfTeacher, id, organizationUser])

  useEffect(() => {
    if (!attendance || !org) {
      return
    }
    // TODO: cleanup
    fetchOrgUser(org.id, attendance.teacher)
  }, [attendance, fetchOrgUser, org])

  const fetchAttendanceById = useCallback(
    async (id: string) => {
      // TODO: cleanup
      try {
        await fetchAttendance(orgKey, id)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, fetchAttendance, orgKey]
  )
  useEffect(() => {
    if (id) {
      fetchAttendanceById(id)
    }
  }, [fetchAttendanceById, id])

  useEffect(() => {
    if (group?.id) {
      fetchStudentsOfGroup(group.id, date)
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, date, fetchStudentsOfGroup, group?.id])

  if (groupsFetching || attendancesLoading || !organizationUser) {
    // TODO
    return <div>Loading</div>
  }

  return (
    <>
      <AttendanceEditor
        activities={groups}
        onSubmit={onSubmit}
        attendance={attendance}
        students={studentsOfGroup}
        studentsLoading={studentsFetching}
        onGroupChanged={onGroupChanged}
        onDateChanged={onDateChanged}
        teacher={attendanceTeacher}
        onDelete={onDelete}
      />
    </>
  )
}

export default AttendanceEditorPage
