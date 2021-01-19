import React from 'react'
import { Text } from '../text/Text'
import './styles.css'

interface Props {
  text: string
}
export const SectionHeader: React.FC<Props> = ({ text }) => {
  return (
    <Text type="h4" className="section-header">
      {text}
    </Text>
  )
}
