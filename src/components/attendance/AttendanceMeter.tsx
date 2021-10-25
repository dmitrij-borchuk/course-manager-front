import React from 'react'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
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
  const progressText = `${Math.round(progress * 100)}%`
  return (
    <div className={`${className} attendance-meter flex items-center h-16 rounded p-5 relative overflow-hidden`}>
      <Progress progress={progress} />
      <div className="flex justify-between w-full">
        <Ellipsis className="z-10">
          <Text size="16">{text}</Text>
        </Ellipsis>
        <Text className="z-10" size="16">
          {progressText}
        </Text>
      </div>
    </div>
  )
}
