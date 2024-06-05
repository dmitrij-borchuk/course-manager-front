import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useOrganizationsState } from '../../store'
import { EditOrganization } from '../../components/organizations/EditOrganization'
import { ROUTES } from '../../constants'
import { ExternalError } from '../../hooks/useFormWithError'
import { OrganizationCreate } from '../../types/organization'
import { isAxiosError } from '../../api/request'

export const CreateOrganizationPage = () => {
  const intl = useIntl()
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
        if (isAxiosError<{ message: string }>(error)) {
          setError({
            fields: [
              {
                field: 'key',
                message: error.response?.data.message || intl.formatMessage({ id: 'common.error.unknown' }),
              },
            ],
          })
        }
      }
    },
    [history, intl, save]
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
