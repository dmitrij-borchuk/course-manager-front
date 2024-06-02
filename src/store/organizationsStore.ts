import { useCallback, useState } from 'react'
import { getUserOrganizations } from 'modules/organizations/api/list'
import { createOrganizations, getInviteInfo, migrateOrganizations } from '../api/organizations'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { InviteInfo, Organization, OrganizationCreate } from '../types/organization'
import { arrayToDictionary } from '../utils/common'

export default function useOrganizationsBaseStore() {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [byId, setById] = useState<Dictionary<Organization>>()
  const allItems = useDictionaryToArray(byId || empty)
  const [[inviteInfo, setInviteInfo], [inviteInfoError, setInviteInfoError]] = useQueryData<InviteInfo>()

  return {
    inviteInfo,
    inviteInfoError,
    allItems,
    byId,
    loading,
    submitting,
    fetchAll: useCallback(async () => {
      setLoading(true)
      try {
        const organizations = await getUserOrganizations()
        const recordsById = arrayToDictionary(organizations.data)
        setById(recordsById)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    }, []),
    // TODO: rename to `add`
    save: useCallback(async (data: OrganizationCreate) => {
      // TODO: remove `creator`
      try {
        setSubmitting(true)
        const result = await createOrganizations(data)

        setById((list) => ({
          ...list,
          [result.data.id]: result.data,
        }))
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    migrate: useCallback(async () => {
      try {
        setSubmitting(true)
        const result = await migrateOrganizations()
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    getInviteInfo: useCallback(
      async (token: string) => {
        setLoading(true)
        try {
          const response = await getInviteInfo(token)
          setInviteInfo(response.data)
        } catch (error) {
          if (error instanceof Error) {
            setInviteInfoError(error)
          } else {
            throw error
          }
        } finally {
          setLoading(false)
        }
      },
      [setInviteInfo, setInviteInfoError]
    ),
  }
}

const empty: Dictionary<Organization> = {}

function useQueryData<T>() {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)

  return [
    [data, setData],
    [error, setError],
    [loading, setLoading],
  ] as const
}
