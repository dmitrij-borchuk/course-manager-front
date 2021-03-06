import React from 'react'
import { Text } from '../kit/text/Text'
import './styles.css'

interface ProgressProps {
  progress: number
}
const Progress: React.FC<ProgressProps> = ({ progress }) => {
  return <div className="attendance-progress absolute inset-0" style={{ width: `${progress * 100}%` }} />
}

interface Props {
  text?: string
  /* progress: 0 - 1 */
  progress?: number
  className?: string
}
export const AttendanceMeter: React.FC<Props> = ({ className = '', text = '', progress = 1 }) => {
  return (
    <div className={`${className} attendance-meter flex items-center h-16 rounded p-5 relative overflow-hidden`}>
      <Progress progress={progress} />
      <Text className="z-10" size="16">
        {text}
      </Text>
    </div>
  )
}
