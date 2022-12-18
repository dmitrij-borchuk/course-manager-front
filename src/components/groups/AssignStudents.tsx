import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useQuery } from '../../hooks/useQuery'
import { useToggle } from '../../hooks/useToggle'
import { useStudentsOfGroupState, useStudentsState } from '../../store'
import { Activity } from '../../types/activity'
import { Student } from '../../types/student'
import { getDiff, noop } from '../../utils/common'
import { SelectStudentsDialog } from './SelectStudentsDialog'

interface Props {
  group: Activity
  studentsOfGroup?: Student[]
  onDone?: () => void
  trigger?: ModalProps['trigger']
}
export const AssignStudents = ({ group, onDone = noop, trigger, studentsOfGroup }: Props) => {
  const { addToast } = useToasts()
  const query = useQuery()
  const history = useHistory()
  const action = query.get('action')
  const intl = useIntl()
  const org = useCurrentOrg()
  const orgId = org?.id
  const [open, toggler] = useToggle(action === 'openStudentsDialog')
  const { students, studentsById, fetching, fetchStudents } = useStudentsState()
  const { addStudentToGroup, deleteStudentFromGroup } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Student[]) => {
      try {
        const initialStudentsIds = (studentsOfGroup || [])?.map((s) => s.id)
        const resultStudentsIds = data.map((s) => s.id)
        const { added, removed } = getDiff(initialStudentsIds, resultStudentsIds)
        await Promise.all(
          added.map(async (sId) => {
            const student = studentsById.get(sId)
            if (!student) {
              throw new Error(`Student with id ${sId} not found in the store`)
            }
            return addStudentToGroup(group.id, student.id)
          })
        )
        await Promise.all(
          removed.map(async (sId) => {
            const student = studentsById.get(sId)
            if (!student) {
              throw new Error(`Student with id ${sId} not found in the store`)
            }

            return deleteStudentFromGroup(group.id, student.id)
          })
        )
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
    [addStudentToGroup, addToast, deleteStudentFromGroup, group.id, onDone, studentsById, studentsOfGroup, toggler]
  )

  useEffect(() => {
    if (orgId) {
      fetchStudents(orgId)
    }
  }, [fetchStudents, orgId])

  useEffect(() => {
    if (query.get('action') && !open) {
      query.delete('action')
      history.replace({
        search: query.toString(),
      })
    }
  }, [open, history, query])

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
        groupId={group.id}
      />
    </>
  )
}
