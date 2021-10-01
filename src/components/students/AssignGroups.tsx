import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useOrgId } from '../../hooks/useOrgId'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useStudentsOfGroupState } from '../../store'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { getDiff, noop } from '../../utils/common'
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
  const { addGroupToStudent, deleteGroupFromStudent } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Group[]) => {
      const initialGroupsIds = (initialGroups || [])?.map((g) => g.id)
      const resultGroupsIds = data.map((g) => g.id)
      const { added, removed } = getDiff(initialGroupsIds, resultGroupsIds)
      await Promise.all(
        added.map(async (gId) =>
          addGroupToStudent(orgId, {
            studentId: student.id,
            groupId: gId,
          })
        )
      )
      await Promise.all(removed.map(async (gId) => deleteGroupFromStudent(orgId, gId, student.id)))
      toggler.off()
      onDone()
    },
    [addGroupToStudent, deleteGroupFromStudent, initialGroups, onDone, orgId, student.id, toggler]
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
