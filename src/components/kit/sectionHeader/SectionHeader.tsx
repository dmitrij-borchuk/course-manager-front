import React from 'react'
import { Text } from '../text/Text'
import './styles.css'

interface Props {
  className?: string
}
export const SectionHeader: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <Text type="h4" className={`section-header ${className}`}>
      {children}
    </Text>
  )
}
