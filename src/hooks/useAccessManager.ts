import { useCallback, useMemo } from 'react'
import { useCurrentOrg } from './useCurrentOrg'

const ACTIONS = ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS', 'VIEW_REPORTS'] as const
export type ActionType = typeof ACTIONS[number]
const rolesToActionsMap: Record<string, ActionType[]> = {
  administrator: ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS', 'VIEW_REPORTS'],
  teacher: ['MANAGE_GROUPS', 'MANAGE_STUDENTS'],
}

export function useAccessManager() {
  const organization = useCurrentOrg()
  const hasAccess = useCallback(
    (action: ActionType) => {
      const role = organization?.role || ''
      const actions = rolesToActionsMap[role.toLocaleLowerCase()]

      if (!actions) {
        return false
      }

      return actions.includes(action)
    },
    [organization?.role]
  )

  return useMemo(
    () => ({
      hasAccess,
    }),
    [hasAccess]
  )
}
