import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useToasts } from 'react-toast-notifications'
import { useOrgId } from '../../hooks/useOrgId'
import { useToggle } from '../../hooks/useToggle'
import { useStudentsOfGroupState, useStudentsState } from '../../store'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { getDiff, noop } from '../../utils/common'
import { SelectStudentsDialog } from './SelectStudentsDialog'

interface Props {
  group: Group
  studentsOfGroup?: Student[]
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignStudents = ({ group, onDone = noop, trigger, studentsOfGroup }: Props) => {
  const { addToast } = useToasts()
  const intl = useIntl()
  const orgId = useOrgId()
  const [open, toggler] = useToggle(false)
  const { students, fetching, fetchStudents } = useStudentsState()
  const { addStudentToGroup, deleteStudentFromGroup } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Student[]) => {
      try {
        const initialStudentsIds = (studentsOfGroup || [])?.map((s) => s.id)
        const resultStudentsIds = data.map((s) => s.id)
        const { added, removed } = getDiff(initialStudentsIds, resultStudentsIds)
        await Promise.all(
          added.map(async (sId) =>
            addStudentToGroup(orgId, {
              studentId: sId,
              groupId: group.id,
              startDate: new Date().getTime(),
              endDate: null,
            })
          )
        )
        await Promise.all(removed.map(async (sId) => deleteStudentFromGroup(orgId, sId, group.id)))
        toggler.off()
        onDone()

        addToast(<FormattedMessage id="groups.assignStudents.success" />, {
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
    [addStudentToGroup, addToast, deleteStudentFromGroup, group.id, onDone, orgId, studentsOfGroup, toggler]
  )

  useEffect(() => {
    fetchStudents(orgId)
  }, [fetchStudents, orgId])

  return (
    <>
      <span onClick={toggler.on}>{trigger}</span>
      <SelectStudentsDialog
        loading={fetching}
        open={open}
        header={intl.formatMessage({ id: 'groups.students.assignDialog.header' })}
        items={students}
        onSubmit={onSubmit}
        onClose={toggler.off}
        initial={studentsOfGroup}
      />
    </>
  )
}
