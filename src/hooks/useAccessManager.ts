import { useCallback, useMemo } from 'react'
import { useCurrentUser } from './useCurrentUser'

const ACTIONS = ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS', 'VIEW_REPORTS'] as const
export type ActionType = typeof ACTIONS[number]
const rolesToActionsMap: Record<string, ActionType[]> = {
  Administrator: ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS', 'VIEW_REPORTS'],
  Teacher: ['MANAGE_GROUPS', 'MANAGE_STUDENTS'],
}

export function useAccessManager() {
  const { organizationUser } = useCurrentUser()
  const hasAccess = useCallback(
    (action: ActionType) => {
      const actions = rolesToActionsMap[organizationUser?.role || '']

      if (!actions) {
        return false
      }

      return actions.includes(action)
    },
    [organizationUser?.role]
  )

  return useMemo(
    () => ({
      hasAccess,
    }),
    [hasAccess]
  )
}
