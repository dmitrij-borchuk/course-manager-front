import { useCallback, useMemo } from 'react'
import { OrganizationUser } from '../types/user'

const ACTIONS = ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS'] as const
export type ActionType = typeof ACTIONS[number]
const rolesToActionsMap: Record<string, ActionType[]> = {
  Administrator: ['MANAGE_TEACHERS', 'MANAGE_GROUPS', 'MANAGE_STUDENTS'],
  Teacher: [],
}

export function useAccessManager(user?: OrganizationUser) {
  const hasAccess = useCallback(
    (action: ActionType) => {
      const actions = rolesToActionsMap[user?.role || '']

      if (!actions) {
        return false
      }

      return actions.includes(action)
    },
    [user?.role]
  )

  return useMemo(
    () => ({
      hasAccess,
    }),
    [hasAccess]
  )
}
