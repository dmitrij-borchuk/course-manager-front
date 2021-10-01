import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useOrgId } from '../../hooks/useOrgId'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useStudentsState } from '../../store'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  student: Student
  onDone?: () => void
  trigger?: ModalProps['trigger']
  initialGroups: Group[]
}
export const AssignGroups = ({ student, onDone = noop, trigger, initialGroups }: Props) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching } = useGroupsState()
  const { editStudent } = useStudentsState()
  const onSubmit = useCallback(
    async (data: Group[]) => {
      await editStudent(orgId, {
        ...student,
        // groups: data.map((g) => g.id),
        // attendances: student.attendances.map((a) => a.id),
      })
      toggler.off()
      onDone()
    },
    [editStudent, onDone, orgId, student, toggler]
  )

  useEffect(() => {
    fetchGroups(orgId)
  }, [fetchGroups, orgId])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'students.groups.assignDialog.header' })}
        items={groups}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        initial={initialGroups}
        multiSelect
      />
    </>
  )
}
