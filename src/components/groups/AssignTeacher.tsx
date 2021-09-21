import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useOrgId } from '../../hooks/useOrgId'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useTeachersState } from '../../store'
import { GroupFull } from '../../types/group'
import { OrganizationUser } from '../../types/user'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  group: GroupFull
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignTeacher = ({ group, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const [open, toggler] = useToggle(false)
  const { editGroup } = useGroupsState()
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const onSubmit = useCallback(
    async (data: OrganizationUser) => {
      await editGroup({
        ...group,
        teacher: data.id,
        students: group.students?.map((s) => s.id),
        schedules: group.schedules.map((s) => s.id),
      })
      toggler.off()
      onDone()
    },
    [editGroup, group, onDone, toggler]
  )

  useEffect(() => {
    if (orgId) {
      fetchTeachers(orgId)
    }
  }, [fetchTeachers, orgId])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'groups.teacher.assignDialog.header' })}
        onSubmit={onSubmit}
        items={teachers}
        labelProp={(t) => t.name}
        onCloseStart={toggler.off}
      />
    </>
  )
}
