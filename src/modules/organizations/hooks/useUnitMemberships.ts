import { useState, useEffect, useCallback } from 'react'
import {
  getUnitMembershipsRequest,
  addUnitMembershipRequest,
  endMembershipRequest,
  reassignMembershipRequest,
} from 'api/organizationUnits'
import { OrgUnitMembership } from 'types/organizationUnit'

type State = {
  memberships: OrgUnitMembership[]
  isLoading: boolean
  error: string | null
}

export function useUnitMemberships(unitId: string) {
  const [state, setState] = useState<State>({ memberships: [], isLoading: true, error: null })

  const load = useCallback(async () => {
    if (!unitId) return
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const res = await getUnitMembershipsRequest(unitId)
      setState({ memberships: res.data, isLoading: false, error: null })
    } catch {
      setState({ memberships: [], isLoading: false, error: 'Failed to load memberships.' })
    }
  }, [unitId])

  useEffect(() => {
    load()
  }, [load])

  const addMember = useCallback(
    async (participantId: number, subjectType = 'student') => {
      const res = await addUnitMembershipRequest(unitId, participantId, { subjectType })
      await load()
      return res.data
    },
    [unitId, load]
  )

  const endMember = useCallback(
    async (membershipId: string) => {
      await endMembershipRequest(membershipId, new Date().toISOString())
      await load()
    },
    [load]
  )

  const reassignMember = useCallback(
    async (membershipId: string, newUnitId: string) => {
      await reassignMembershipRequest(membershipId, newUnitId)
      await load()
    },
    [load]
  )

  return { ...state, addMember, endMember, reassignMember, reload: load }
}
