import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useOrganizationsState } from '../../store'
import { EditOrganization } from '../../components/organizations/EditOrganization'
import { ROUTES } from '../../constants'
import { ExternalError } from '../../hooks/useFormWithError'
import { OrganizationCreate } from '../../types/organization'
import { isAxiosError } from '../../api/request'

export const CreateOrganizationPage = () => {
  const history = useHistory()
  const { save, submitting, fetchAll, loading } = useOrganizationsState()
  const [error, setError] = useState<ExternalError<OrganizationCreate>>()
  const submit = useCallback(
    async (data: OrganizationCreate) => {
      try {
        await save({
          ...data,
        })

        history.push(`${ROUTES.ROOT}`)
      } catch (error) {
        if (isAxiosError(error)) {
          setError({
            fields: [
              {
                field: 'key',
                message: error.response?.data.message,
              },
            ],
          })
        }
      }
    },
    [history, save]
  )

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <>
      <EditOrganization onSubmit={submit} loading={submitting || loading} error={error} />
    </>
  )
}

export default CreateOrganizationPage
