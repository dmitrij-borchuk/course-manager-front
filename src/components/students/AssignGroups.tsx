import React, { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useStudentsState } from '../../store'
import { Group } from '../../types/group'
import { StudentFull } from '../../types/student'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  student: StudentFull
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignGroups = ({ student, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching } = useGroupsState()
  const { editStudent } = useStudentsState()
  // Make 'Group[]' from 'GroupFull[]'
  const groupsSimple = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        teacher: g.teacher?.id,
        students: g.students?.map((s) => s.id),
      })),
    [groups]
  )
  const onSubmit = useCallback(
    async (data: Group[]) => {
      await editStudent({
        ...student,
        groups: data.map((g) => g.id),
        attendances: student.attendances.map((a) => a.id),
      })
      toggler.off()
      onDone()
    },
    [editStudent, onDone, student, toggler]
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
        header={intl.formatMessage({ id: 'students.groups.assignDialog.header' })}
        items={groupsSimple}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        initial={student.groups}
        multiSelect
      />
    </>
  )
}
