import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from '../../hooks/useQuery'
import { useGroupsState } from '../../store'
import { createSchedule, editSchedule } from '../../services/schedule'
import { EditSchedule, ScheduleFormData } from '../../components/Schedule/EditSchedule'
import { ROUTES } from '../../constants'
import { Message } from '../../components/kit/message/Message'

export const SchedulePage = () => {
  const history = useHistory()
  const query = useQuery()
  const groupId = query.get('group')
  const { fetchGroup, groupsById } = useGroupsState()
  const group = groupId ? groupsById[groupId] : null

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId)
    }
  }, [fetchGroup, groupId])

  // We use only one schedule
  const schedule = group?.schedules[0]
  // TODO: loading

  const onSubmit = useCallback(
    async (data: ScheduleFormData) => {
      if (!groupId) {
        throw new Error('Group is not provided')
      }

      if (!schedule) {
        await createSchedule({
          ...data,
          group: groupId,
        })
      } else {
        await editSchedule({
          ...schedule,
          ...data,
          group: groupId,
        })
      }
      history.push(`${ROUTES.GROUPS_ROOT}/${groupId}`)
    },
    [groupId, history, schedule]
  )

  if (!group) {
    // TODO
    return <Message>Group not found</Message>
  }

  return <EditSchedule onSubmit={onSubmit} initial={schedule} />
}

export default SchedulePage
