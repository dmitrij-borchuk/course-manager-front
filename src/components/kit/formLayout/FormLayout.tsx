import React, { ReactNode } from 'react'
import { SectionHeader } from '../sectionHeader/SectionHeader'

interface Props {
  header: ReactNode
  controls: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
export const FormLayout: React.FC<Props> = ({ header, children, controls, onSubmit }) => {
  return (
    <div>
      <SectionHeader>{header}</SectionHeader>

      <form onSubmit={onSubmit}>
        {children}

        <div className="flex flex-row-reverse">{controls}</div>
      </form>
    </div>
  )
}
