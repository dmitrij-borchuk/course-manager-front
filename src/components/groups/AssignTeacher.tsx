import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { useOrgId } from '../../hooks/useOrgId'
import { useToggle } from '../../hooks/useToggle'
import { useGroupsState, useTeachersState } from '../../store'
import { GroupFull } from '../../types/group'
import { OrganizationUser } from '../../types/user'
import { noop } from '../../utils/common'
import { SelectDialog } from '../kit/selectDialog/SelectDialog'

interface Props {
  group: GroupFull
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignTeacher = ({ group, onDone = noop, trigger }: Props) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const [open, toggler] = useToggle(false)
  const { editGroup } = useGroupsState()
  const { addToast } = useToasts()
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const onSubmit = useCallback(
    async (data: OrganizationUser) => {
      try {
        await editGroup(orgId, {
          id: group.id,
          teacher: data.id,
        })
        toggler.off()
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
    [addToast, editGroup, group, onDone, orgId, toggler]
  )

  useEffect(() => {
    if (orgId) {
      fetchTeachers(orgId)
    }
  }, [fetchTeachers, orgId])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'groups.teacher.assignDialog.header' })}
        onSubmit={onSubmit}
        items={teachers}
        labelProp={(t) => t.name}
        onCloseStart={toggler.off}
      />
    </>
  )
}
