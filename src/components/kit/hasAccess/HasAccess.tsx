import React from 'react'
import { ActionType, useAccessManager } from '../../../hooks/useAccessManager'
import { useCurrentUser } from '../../../hooks/useCurrentUser'

interface Props {
  action: ActionType
}
export const HasAccess: React.FC<Props> = ({ action, children }) => {
  const { organizationUser } = useCurrentUser()
  const { hasAccess } = useAccessManager(organizationUser)

  if (!hasAccess(action) || !children) {
    return null
  }

  return <>{children}</>
}
