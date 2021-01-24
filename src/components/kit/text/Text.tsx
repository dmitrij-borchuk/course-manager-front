import React, { ReactNode } from 'react'
import './styles.css'

type Color = 'primary' | 'secondary' | 'textGray' | 'textLight' | 'text' | 'alert' | 'warning'
type Size = '16' | '25' | '34' | '43' | '52' | '63'
type HeadingType = React.HTMLAttributes<HTMLHeadingElement>
type ParagraphType = React.HTMLAttributes<HTMLParagraphElement>
type TextType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body'

const color2className: Record<Color, string> = {
  primary: 'color-primary',
  secondary: 'color-secondary',
  textGray: 'color-text-gray',
  textLight: 'color-text-light',
  text: 'color-text',
  alert: 'color-alert',
  warning: 'color-warning',
}

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
  children: string | ReactNode
  type?: TextType
  className?: string
  size?: Size
  color?: 'primary' | 'secondary' | 'textGray' | 'textLight' | 'text' | 'alert' | 'warning'
}
export const Text: React.FC<Props> = ({ children, type = 'body', className = '', size, color }) => {
  const Component = components[type]
  return (
    <Component
      className={`${color ? color2className[color] : ''} ${className}`}
      style={{ fontSize: size ? `${size}px` : undefined }}
    >
      {children}
    </Component>
  )
}
