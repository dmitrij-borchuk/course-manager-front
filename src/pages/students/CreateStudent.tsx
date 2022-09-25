import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { TITLE_POSTFIX } from '../../config'
import { ROUTES } from '../../constants'
import { useQuery } from '../../hooks/useQuery'
import { useStudentsState } from '../../store'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useOrgId } from '../../hooks/useOrgId'

export const CreateStudent = () => {
  const query = useQuery()
  const { addToast } = useToasts()
  const history = useHistory()
  const org = useCurrentOrg()
  const orgKey = useOrgId()
  const orgId = org?.id
  const { createStudent, submitting } = useStudentsState()
  const backUrl = query.get('backUrl')

  const submit = useCallback(
    async (data: StudentForm) => {
      if (!orgId) {
        throw new Error('Organization is not defined')
      }
      try {
        await createStudent(orgId, {
          ...data,
        })
        history.push(backUrl || `/${orgKey}${ROUTES.STUDENTS_LIST}`)

        addToast(<FormattedMessage id="students.create.success" />, {
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
    [addToast, backUrl, createStudent, history, orgId, orgKey]
  )

  return (
    <>
      <Helmet>
        <title>Create Student{TITLE_POSTFIX}</title>
      </Helmet>

      <EditStudent onSubmit={submit} loading={submitting} />
    </>
  )
}

export default CreateStudent
