import React, { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState } from '../../store'
import { Activity } from '../../types/activity'
import { OrganizationUser } from '../../types/user'
import { getDiff, noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  teacher: OrganizationUser
  onDone?: () => void
  trigger?: ModalProps['trigger']
  teachersGroups?: Activity[]
}
export const AssignGroups = ({ teacher, onDone = noop, trigger, teachersGroups = [] }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { addToast } = useToasts()
  const { groups, fetchGroups, fetching, editGroup } = useGroupsState()
  const onSubmit = useCallback(
    async (data: Activity[]) => {
      try {
        const { added, removed } = getDiff(
          teachersGroups.map((g) => g.id),
          data.map((g) => g.id)
        )
        for (let index = 0; index < removed.length; index++) {
          await editGroup(removed[index], {
            performerId: null,
          })
        }
        for (let index = 0; index < added.length; index++) {
          await editGroup(added[index], {
            performerId: teacher.id,
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
    [addToast, editGroup, onDone, teacher.id, teachersGroups, toggler]
  )
  const onTriggerClick = useCallback(async () => {
    toggler.on()
    fetchGroups()
  }, [fetchGroups, toggler])

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
        data-testid="assign-activity-dialog"
      />
    </>
  )
}
