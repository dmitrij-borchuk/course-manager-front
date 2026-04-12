import React, { ReactNode } from 'react'
import { SectionHeader } from '@/molecules/layout'
import { Form } from '@/components/organisms/form'
import { Flex } from '@/atoms/layout'

interface Props {
  className?: string
  header?: ReactNode
  controls?: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  children: ReactNode
  formUtils?: any
}
export const FormLayout: React.FC<Props> = ({ className = '', header, children, controls, onSubmit, formUtils }) => {
  // `pt-1` is a workeround to make margin be inside container
  return (
    <Flex column gap={2} className={`pt-1 ${className}`}>
      {header && <SectionHeader>{header}</SectionHeader>}

      <Form formUtils={formUtils} onSubmit={onSubmit}>
        {children}

        {controls && <div className="flex flex-row-reverse pt-4">{controls}</div>}
      </Form>
    </Flex>
  )
}
