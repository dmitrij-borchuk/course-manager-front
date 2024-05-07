import { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { Profile } from 'types/profile'
import { useProfiles } from 'modules/profiles/hooks'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState } from '../../store'
import { Activity } from '../../types/activity'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  group: Activity
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignTeacher = ({ group, onDone = noop, trigger }: Props) => {
  const [open, toggler] = useToggle(false)

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      {open && (
        <AssignTeacherDialog
          group={group}
          onDone={() => {
            toggler.off()
            onDone()
          }}
          open={open}
          onClose={toggler.off}
        />
      )}
    </>
  )
}

interface AssignTeacherDialogProps {
  group: Activity
  onDone?: () => void
  onClose?: () => void
  open: boolean
}
export const AssignTeacherDialog = ({ group, onDone = noop, onClose, open }: AssignTeacherDialogProps) => {
  const intl = useIntl()
  const { editGroup } = useGroupsState()
  const { addToast } = useToasts()
  const profilesQuery = useProfiles(false)
  const onSubmit = useCallback(
    async (data: Profile) => {
      try {
        await editGroup(group.id, {
          name: group.name,
          performerId: data.user.id,
        })
        onDone()

        addToast(<FormattedMessage id="groups.assignTeacher.success" />, {
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
    [addToast, editGroup, group.id, group.name, onDone]
  )

  return (
    <>
      <SelectDialog
        loading={profilesQuery.isFetching}
        open={open}
        header={intl.formatMessage({ id: 'groups.teacher.assignDialog.header' })}
        onSubmit={onSubmit}
        items={profilesQuery.data || []}
        labelProp={(t) => t.name}
        onCloseStart={onClose}
        data-testid="assign-teacher-dialog"
      />
    </>
  )
}
