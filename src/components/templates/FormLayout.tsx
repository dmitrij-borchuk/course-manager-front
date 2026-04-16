import React, { ReactNode } from 'react'
import { SectionHeader } from '@/molecules/layout'
import { Form } from '@/components/organisms/form'
import { Flex } from '@/atoms/layout'
import { FieldValues, UseFormReturn } from 'react-hook-form'

interface Props<T extends FieldValues, C> {
  className?: string
  header?: ReactNode
  controls?: ReactNode
  onSubmit: (event: T) => void
  children: ReactNode
  formUtils: UseFormReturn<T, C, T>
}
export function FormLayout<T extends FieldValues, C>({
  className = '',
  header,
  children,
  controls,
  onSubmit,
  formUtils,
}: Props<T, C>) {
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
