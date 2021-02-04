import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const CollectionItemLink: React.FC<LinkProps> = ({ children, className, ...props }) => {
  return (
    <Link className={`collection-item ${className}`} {...props}>
      {children}
    </Link>
  )
}
