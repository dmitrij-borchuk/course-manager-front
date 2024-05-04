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
  const [open, toggler] = useToggle(false)

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      {open && (
        <AssignGroupsSelector
          open={open}
          initialGroups={initialGroups}
          student={student}
          onClose={toggler.off}
          onDone={() => {
            onDone()
            toggler.off()
          }}
        />
      )}
    </>
  )
}

interface AssignGroupsSelectorProps {
  student: Student
  onDone?: () => void
  onClose?: () => void
  initialGroups: Activity[]
  open: boolean
}
export const AssignGroupsSelector = ({
  student,
  onDone = noop,
  initialGroups,
  open,
  onClose,
}: AssignGroupsSelectorProps) => {
  const intl = useIntl()
  const { addToast } = useToasts()
  const { groups, fetchGroups, fetching } = useGroupsState()
  const { addGroupToStudent } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Activity[]) => {
      try {
        // TODO: make butch request
        await Promise.all(data.map(async (item) => addGroupToStudent(item.id, student.id)))
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
    [addGroupToStudent, addToast, onDone, student]
  )
  const initialIds = initialGroups?.map((g) => g.id) || []
  const itemsToShow = groups.filter((g) => !initialIds.includes(g.id))

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return (
    <>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'students.groups.assignDialog.header' })}
        items={itemsToShow}
        onSubmit={onSubmit}
        labelProp={(g) => g.name}
        onCloseStart={onClose}
        multiSelect
        data-testid="assign-group-dialog"
      />
    </>
  )
}
