import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useOrgId } from '../../hooks/useOrgId'
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
  const orgId = useOrgId()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching, editGroup } = useGroupsState()
  const onSubmit = useCallback(
    async (data: Group[]) => {
      for (let index = 0; index < data.length; index++) {
        const group = data[index]
        // TODO: fix unselect groups
        await editGroup(orgId, {
          id: group.id,
          teacher: teacher.id,
        })
      }
      toggler.off()
      onDone()
    },
    [editGroup, onDone, orgId, teacher.id, toggler]
  )
  const onTriggerClick = useCallback(async () => {
    toggler.on()
    fetchGroups(orgId)
  }, [fetchGroups, orgId, toggler])

  return (
    <>
      <span onClick={onTriggerClick}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'teachers.groups.assignDialog.header' })}
        items={groups}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        initial={teachersGroups}
        multiSelect
      />
    </>
  )
}
