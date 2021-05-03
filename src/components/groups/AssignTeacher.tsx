import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useTeachersState } from '../../store'
import { GroupFull } from '../../types/group'
import { UserInfoFull } from '../../types/userInfo'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  group: GroupFull
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignTeacher = ({ group, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { editGroup } = useGroupsState()
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const onSubmit = useCallback(
    async (data: UserInfoFull) => {
      await editGroup({
        ...group,
        teacher: data.id,
        students: group.students?.map((s) => s.id),
      })
      toggler.off()
      onDone()
    },
    [editGroup, group, onDone, toggler]
  )

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

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
