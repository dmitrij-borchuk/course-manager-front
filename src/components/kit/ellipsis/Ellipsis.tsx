import React from 'react'

interface Props {
  className?: string
}
export const Ellipsis: React.FC<Props> = ({ children, className = '' }) => {
  const stringContent = typeof children === 'string'
  return (
    <div
      className={`overflow-ellipsis overflow-hidden whitespace-nowrap ${className}`}
      title={stringContent ? children : ''}
    >
      {children}
    </div>
  )
}
