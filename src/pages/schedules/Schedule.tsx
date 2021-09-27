import React, { useCallback, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import { useQuery } from '../../hooks/useQuery'
import { useGroupsState } from '../../store'
// import { createSchedule, editSchedule } from '../../services/schedule'
import { EditSchedule, ScheduleFormData } from '../../components/Schedule/EditSchedule'
// import { ROUTES } from '../../constants'
import { Message } from '../../components/kit/message/Message'
import { useOrgId } from '../../hooks/useOrgId'

export const SchedulePage = () => {
  const query = useQuery()
  const orgId = useOrgId()
  const groupId = query.get('group')
  const { fetchGroup, groupsById } = useGroupsState()
  const group = groupId ? groupsById[groupId] : null

  useEffect(() => {
    if (groupId) {
      fetchGroup(orgId, groupId)
    }
  }, [fetchGroup, groupId, orgId])

  // We use only one schedule
  // const schedule = group?.schedules && group?.schedules[0]
  // TODO: loading

  const onSubmit = useCallback(async (data: ScheduleFormData) => {
    // TODO
    // if (!groupId) {
    //   throw new Error('Group is not provided')
    // }
    // if (!schedule) {
    //   await createSchedule({
    //     ...data,
    //     group: groupId,
    //   })
    // } else {
    //   await editSchedule({
    //     ...schedule,
    //     ...data,
    //     group: groupId,
    //   })
    // }
    // history.push(`${ROUTES.GROUPS_ROOT}/${groupId}`)
  }, [])

  if (!group) {
    // TODO
    return <Message>Group not found</Message>
  }

  return <EditSchedule onSubmit={onSubmit} /* initial={schedule} */ />
}

export default SchedulePage
