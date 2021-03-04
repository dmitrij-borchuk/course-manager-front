import React from 'react'

interface Props {
  className?: string
  children: string
}
export const Ellipsis: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-ellipsis overflow-hidden ${className}`} title={children}>
      {children}
    </div>
  )
}
