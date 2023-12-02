import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useStudentsOfGroupState } from '../../store'
import { Activity } from '../../types/activity'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  student: Student
  onDone?: () => void
  trigger?: ModalProps['trigger']
  initialGroups: Activity[]
}
export const AssignGroups = ({ student, onDone = noop, trigger, initialGroups }: Props) => {
  const intl = useIntl()
  const { addToast } = useToasts()
  const [open, toggler] = useToggle(false)
  const { groups, fetchGroups, fetching } = useGroupsState()
  const { addGroupToStudent } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Activity[]) => {
      try {
        // TODO: make butch request
        await Promise.all(data.map(async (item) => addGroupToStudent(item.id, student.id)))
        toggler.off()
        onDone()

        addToast(<FormattedMessage id="students.assignGroups.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    },
    [addGroupToStudent, addToast, onDone, student, toggler]
  )
  const initialIds = initialGroups?.map((g) => g.id) || []
  const itemsToShow = groups.filter((g) => !initialIds.includes(g.id))

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
        items={itemsToShow}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={toggler.off}
        multiSelect
        data-testid="assign-group-dialog"
      />
    </>
  )
}
