import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router'
import { useNotification } from 'hooks/useNotification'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useQuery } from '../../hooks/useQuery'
import { useStudentsState } from '../../store'
import { nanoid } from 'nanoid'
import { checkStudentExistence } from 'modules/students/api'
import { ConfirmationDialogBase } from 'components/kit/ConfirmationDialog/ConfirmationDialog'
import { StudentBase } from 'types/student'

export const CreateStudent = () => {
  const queryParams = useQuery()
  const { showError, showSuccess } = useNotification()
  const history = useHistory()
  const { createStudent, submitting } = useStudentsState()
  const backUrl = queryParams.get('backUrl') ?? ROUTES.STUDENTS_LIST
  const [confirmationDialog, setConfirmationDialog] = useState<StudentBase>()
  const [data, setData] = useState<StudentForm>()

  const create = useCallback(
    async (data: StudentForm) => {
      try {
        await createStudent({
          ...data,
          outerId: nanoid(),
        })
        history.push(backUrl)

        showSuccess(<FormattedMessage id="students.create.success" />)
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message)
        }
      }
    },
    [backUrl, createStudent, history, showError, showSuccess]
  )

  const submit = useCallback(
    async (data: StudentForm) => {
      const existingStudent = await checkStudentExistence(data.name.trim())

      if (existingStudent.data) {
        setData(data)
        setConfirmationDialog(existingStudent.data)
      } else {
        return create(data)
      }
    },
    [create]
  )

  return (
    <>
      <EditStudent onSubmit={submit} loading={submitting} />

      <ConfirmationDialogBase
        title={<FormattedMessage id="students.creation.existingConfirmation.title" />}
        onClose={() => setConfirmationDialog(undefined)}
        onSubmit={() => data && create(data)}
        open={!!confirmationDialog}
        confirmBtnProps={{
          variant: 'contained',
          color: 'error',
        }}
      >
        <FormattedMessage
          id="students.creation.existingConfirmation.body"
          values={{ name: confirmationDialog?.name }}
        />
      </ConfirmationDialogBase>
    </>
  )
}

export default CreateStudent
