import React, { useCallback, useEffect } from 'react'
import { useQuery } from '../../hooks/useQuery'
import { useGroupsState } from '../../store'
import { EditSchedule, ScheduleFormData } from '../../components/Schedule/EditSchedule'
import { Message } from '../../components/kit/message/Message'

export const SchedulePage = () => {
  const query = useQuery()
  const groupIdQuery = query.get('group')
  const groupId = groupIdQuery ? parseInt(groupIdQuery) : null
  const { fetchGroup, groupsById } = useGroupsState()
  const group = groupId ? groupsById.get(groupId) : null

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId)
    }
  }, [fetchGroup, groupId])

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

  return (
    <>
      <EditSchedule onSubmit={onSubmit} /* initial={schedule} */ />
    </>
  )
}

export default SchedulePage
