import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { Loader } from '../../components/kit/loader/Loader'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentsState } from '../../store'
import { TITLE_POSTFIX } from '../../config'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'

export const EditStudentPage = () => {
  const history = useHistory()
  const org = useCurrentOrg()
  const orgId = org?.id
  const orgKey = useOrgId()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)
  const { fetchStudent, editStudent, fetching, submitting, studentsById } = useStudentsState()
  const { addToast } = useToasts()

  const student = studentsById.get(id)
  const update = useCallback(
    async (data: StudentForm) => {
      if (!student) {
        throw new Error('Student is not defined')
      }
      if (!orgId) {
        throw new Error('Organization is not defined')
      }
      try {
        await editStudent(orgId, {
          ...student,
          ...data,
        })
        history.push(`/${orgKey}${ROUTES.STUDENTS_ROOT}/${student.id}`)

        addToast(<FormattedMessage id="students.edit.success" />, {
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
    [addToast, editStudent, history, orgId, orgKey, student]
  )

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])
  // TODO: implement 404

  return (
    <>
      <Helmet>
        <title>Edit Student{TITLE_POSTFIX}</title>
      </Helmet>

      <Loader show={fetching}>
        <EditStudent onSubmit={update} loading={submitting} initial={student} isEdit />
      </Loader>
    </>
  )
}

export default EditStudentPage
