import React from 'react'
import './styles.css'

type HeadingType = React.HTMLAttributes<HTMLHeadingElement>
type ParagraphType = React.HTMLAttributes<HTMLParagraphElement>
type TextType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body'
const components: Record<TextType, React.ComponentType<HeadingType | ParagraphType>> = {
  h1: ({ children, ...props }: HeadingType) => {
    return (
      <h1 className="h1" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: HeadingType) => {
    return (
      <h2 className="h2" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: HeadingType) => {
    return (
      <h3 className="h3" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }: HeadingType) => {
    return (
      <h4 className="h4" {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ children, ...props }: HeadingType) => {
    return (
      <h5 className="h5" {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ children, ...props }: HeadingType) => {
    return (
      <h6 className="h6" {...props}>
        {children}
      </h6>
    )
  },
  body: ({ children, ...props }: ParagraphType) => {
    return (
      <p className="p" {...props}>
        {children}
      </p>
    )
  },
}

interface Props {
  children: string
  type?: TextType
  className?: string
}
export const Text: React.FC<Props> = ({ children, type = 'body', className = '' }) => {
  const Component = components[type]
  return <Component className={className}>{children}</Component>
}
