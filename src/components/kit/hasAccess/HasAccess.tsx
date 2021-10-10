import React from 'react'
import { ActionType, useAccessManager } from '../../../hooks/useAccessManager'

interface Props {
  action: ActionType
}
export const HasAccess: React.FC<Props> = ({ action, children }) => {
  const { hasAccess } = useAccessManager()

  if (!hasAccess(action) || !children) {
    return null
  }

  return <>{children}</>
}
