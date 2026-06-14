import { useState, useEffect, useCallback } from 'react'
import {
  getOrgUnitTreeRequest,
  createOrgUnitRequest,
  updateOrgUnitRequest,
  moveOrgUnitRequest,
  archiveOrgUnitRequest,
} from 'api/organizationUnits'
import { OrganizationUnitTree } from 'types/organizationUnit'

type State = {
  tree: OrganizationUnitTree[]
  isLoading: boolean
  error: string | null
}

export function useOrgUnitTree() {
  const [state, setState] = useState<State>({ tree: [], isLoading: true, error: null })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const res = await getOrgUnitTreeRequest()
      setState({ tree: res.data, isLoading: false, error: null })
    } catch {
      setState({ tree: [], isLoading: false, error: 'Failed to load organizational tree.' })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createUnit = useCallback(
    async (name: string, parentId?: string | null) => {
      await createOrgUnitRequest({ name, parentId })
      await load()
    },
    [load]
  )

  const renameUnit = useCallback(
    async (id: string, name: string) => {
      await updateOrgUnitRequest(id, { name })
      await load()
    },
    [load]
  )

  const moveUnit = useCallback(
    async (id: string, parentId: string | null) => {
      await moveOrgUnitRequest(id, parentId)
      await load()
    },
    [load]
  )

  const archiveUnit = useCallback(
    async (id: string) => {
      await archiveOrgUnitRequest(id)
      await load()
    },
    [load]
  )

  return { ...state, createUnit, renameUnit, moveUnit, archiveUnit, reload: load }
}
