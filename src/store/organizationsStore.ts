import { useCallback, useState } from 'react'
import { organizations, users } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { Organization } from '../types/organization'
import { arrayToDictionary } from '../utils/common'

export default function useOrganizationsBaseStore() {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [byId, setById] = useState<Dictionary<Organization>>({})
  const allItems = useDictionaryToArray(byId)

  return {
    allItems,
    byId,
    loading,
    submitting,
    fetchAll: useCallback(async (userId: string) => {
      setLoading(true)
      const user = await users.getById(userId)
      const promises = user.organizations?.map((id) => organizations.getById(id)) || []
      const resp = await Promise.all(promises)
      const groupsById = arrayToDictionary(resp)
      setById(groupsById)
      setLoading(false)
    }, []),
    save: useCallback(async (data: Organization) => {
      setSubmitting(true)
      await organizations.save(data)
      const user = await users.getById(data.creator)
      await users.save({
        ...user,
        organizations: user.organizations?.concat([data.id]),
      })
      setById((list) => ({
        ...list,
        [data.id]: data,
      }))
      setSubmitting(false)
    }, []),
  }
}
