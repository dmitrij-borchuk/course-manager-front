import { useCallback, useEffect, useState } from 'react'
import { getRolesRequest } from '../api/roles'
import { Role } from '../types/role'

export function getRoles() {
  return getRolesRequest()
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const fetchRoles = useCallback(async () => {
    setLoading(true)
    const result = await getRolesRequest()

    setRoles(result.data.roles)
    setLoading(false)
  }, [])
  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return [roles, loading] as const
}
