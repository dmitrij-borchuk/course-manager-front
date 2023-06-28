import React, { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { useToggle } from '../../hooks/useToggle'
import { Activity } from '../../types/activity'
import { getDiff, noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'
import { useMutation } from 'react-query'
import { editActivity } from 'modules/activities/api'
import { useGroups } from 'store/groupsStore'

interface Props {
  teacherId: number
  onDone?: () => void
  trigger?: ModalProps['trigger']
  teachersGroups?: Activity[]
}
export const AssignGroups = ({ teacherId, onDone = noop, trigger, teachersGroups = [] }: Props) => {
  const intl = useIntl()
  const [open, toggler] = useToggle(false)
  const { addToast } = useToasts()
  const query = useGroups()
  const groups = query.data?.data ?? []
  const fetching = query.isLoading
  const mutation = useMutation((params: { id: number; data: Partial<Activity> }) =>
    editActivity(params.id, params.data)
  )
  const onSubmit = useCallback(
    async (data: Activity[]) => {
      try {
        const { added, removed } = getDiff(
          teachersGroups.map((g) => g.id),
          data.map((g) => g.id)
        )
        for (let index = 0; index < removed.length; index++) {
          await mutation.mutateAsync({
            id: removed[index],
            data: {
              performerId: null,
            },
          })
        }
        for (let index = 0; index < added.length; index++) {
          await mutation.mutateAsync({
            id: added[index],
            data: {
              performerId: teacherId,
            },
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
    [addToast, mutation, onDone, teacherId, teachersGroups, toggler]
  )
  const onTriggerClick = useCallback(async () => {
    toggler.on()
  }, [toggler])

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
