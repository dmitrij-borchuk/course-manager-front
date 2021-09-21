import React, { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState } from '../../store'
import { Group } from '../../types/group'
import { OrganizationUser } from '../../types/user'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  teacher: OrganizationUser
  onDone?: () => void
  trigger?: ModalProps['trigger']
  teachersGroups?: Group[]
}
export const AssignGroups = ({ teacher, onDone = noop, trigger, teachersGroups = [] }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching, editGroup } = useGroupsState()
  // Make 'Group[]' from 'GroupFull[]'
  const groupsSimple = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        teacher: g.teacher?.id,
        students: g.students?.map((s) => s.id),
        schedules: g.schedules.map((s) => s.id),
      })),
    [groups]
  )
  const onSubmit = useCallback(
    async (data: Group[]) => {
      for (let index = 0; index < data.length; index++) {
        const group = data[index]
        await editGroup({
          ...group,
          teacher: teacher.id,
        })
      }
      toggler.off()
      onDone()
    },
    [editGroup, onDone, teacher.id, toggler]
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
        initial={teachersGroups}
        multiSelect
      />
    </>
  )
}
