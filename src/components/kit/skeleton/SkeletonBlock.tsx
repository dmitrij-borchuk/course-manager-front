import React from 'react'
import './styles.css'

interface Props {
  className?: string
  width?: string
  height?: string
  children?: React.ReactNode
}
export const SkeletonBlock: React.FC<Props> = ({ className = '', width, height, children }) => {
  return (
    <div className={`bg-gray-200 overflow-hidden ${className}`} style={{ width, height }}>
      {children}
      <div className="skeleton-gradient"></div>
    </div>
  )
}
