import React, { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useTeachersState } from '../../store'
import { Group } from '../../types/group'
import { TeacherFull } from '../../types/teacher'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  teacher: TeacherFull
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignGroups = ({ teacher, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching } = useGroupsState()
  const { editTeacher } = useTeachersState()
  // Make 'Group[]' from 'GroupFull[]'
  const groupsSimple = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        teacher: g.teacher?.id,
      })),
    [groups]
  )
  const onSubmit = useCallback(
    async (data: Group[]) => {
      await editTeacher({
        ...teacher,
        user: teacher.user?.id,
        groups: data.map((g) => g.id),
      })
      toggler.off()
      onDone()
    },
    [editTeacher, onDone, teacher, toggler]
  )

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'teachers.groups.assignDialog.header' })}
        items={groupsSimple}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        initial={teacher.groups}
        multiSelect
      />
    </>
  )
}
