import { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ModalProps } from 'react-materialize'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useQuery } from '../../hooks/useQuery'
import { useToggle } from '../../hooks/useToggle'
import { useStudentsOfGroupState, useStudentsState } from '../../store'
import { Activity } from '../../types/activity'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
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
  const [open, toggler] = useToggle(action === 'openStudentsDialog')
  const { students, fetching, fetchStudents } = useStudentsState()
  const assignedIds = studentsOfGroup?.map((s) => s.id) ?? []
  const notAssignedParticipants = students.filter((student) => !assignedIds.includes(student.id))
  const { addStudentToGroup } = useStudentsOfGroupState()
  const onSubmit = useCallback(
    async (data: Student[]) => {
      try {
        await Promise.all(
          data.map(async (student) => {
            return addStudentToGroup(group.id, student.id)
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
    [addStudentToGroup, addToast, group.id, onDone, toggler]
  )

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

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
        items={notAssignedParticipants}
        onSubmit={onSubmit}
        onClose={toggler.off}
        groupId={group.id}
      />
    </>
  )
}
