import React, { ReactNode } from 'react'
import { SectionHeader } from '../sectionHeader/SectionHeader'

interface Props {
  className?: string
  header: ReactNode
  controls: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
export const FormLayout: React.FC<Props> = ({ className = '', header, children, controls, onSubmit }) => {
  // `pt-1` is a workeround to make margin be inside container
  return (
    <div className={`pt-1 ${className}`}>
      <SectionHeader>{header}</SectionHeader>

      <form onSubmit={onSubmit}>
        {children}

        <div className="flex flex-row-reverse">{controls}</div>
      </form>
    </div>
  )
}
