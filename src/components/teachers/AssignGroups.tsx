import React, { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
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
  const { addToast } = useToasts()
  const { groups, fetchGroups, fetching, editGroup } = useGroupsState()
  const onSubmit = useCallback(
    async (data: Group[]) => {
      try {
        for (let index = 0; index < data.length; index++) {
          const group = data[index]
          // TODO: fix unselect groups
          await editGroup(orgId, {
            id: group.id,
            teacher: teacher.outerId,
          })
        }
        toggler.off()
        onDone()

        addToast(<FormattedMessage id="teachers.editGroups.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, editGroup, onDone, orgId, teacher.outerId, toggler]
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
