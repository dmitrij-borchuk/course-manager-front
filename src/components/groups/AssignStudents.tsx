import React, { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useStudentsState } from '../../store'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  group: Group
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignStudents = ({ group, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { students, fetching, fetchStudents } = useStudentsState()
  const { editGroup } = useGroupsState()
  // Make 'Student[]' from 'StudentFull[]'
  const studentsSimple = useMemo(
    () =>
      students.map((s) => ({
        ...s,
        groups: s.groups.map((g) => g.id),
        attendances: s.attendances.map((a) => a.id),
      })),
    [students]
  )
  const onSubmit = useCallback(async (data: Student[]) => {
    // TODO: implenemt me
    // await editGroup({
    //   ...group,
    //   teacher: group.teacher?.id,
    //   students: data.map((s) => s.id),
    //   schedules: data.map((s) => s.id),
    // })
    // toggler.off()
    // onDone()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'groups.students.assignDialog.header' })}
        items={studentsSimple}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        // initial={group.students}
        multiSelect
      />
    </>
  )
}
