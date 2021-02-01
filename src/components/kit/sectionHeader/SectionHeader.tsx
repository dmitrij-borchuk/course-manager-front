import React from 'react'
import { Text } from '../text/Text'
import './styles.css'

interface Props {}
export const SectionHeader: React.FC<Props> = ({ children }) => {
  return (
    <Text type="h4" className="section-header">
      {children}
    </Text>
  )
}
