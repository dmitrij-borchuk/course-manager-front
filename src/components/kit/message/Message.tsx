import React from 'react'

interface Props {
  className?: string
}
export const Message: React.FC<Props> = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>
}
