import React from 'react'

type MessageType = 'success' | 'error' | 'info'
interface Props {
  className?: string
  type?: MessageType
}
export const Message: React.FC<Props> = ({ children, type, className = '' }) => {
  const typeToColor: Record<MessageType, string> = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-yellow-400',
  }
  const typeColor = type ? typeToColor[type] : ''

  return <div className={`${typeColor} ${className}`}>{children}</div>
}
