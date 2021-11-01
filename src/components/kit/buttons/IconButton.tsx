import React from 'react'
import { Button, ButtonProps, Icon } from 'react-materialize'
import './styles.css'

export interface IconButtonProps extends ButtonProps {
  icon: string
  size?: number
  type?: 'round' | 'square'
  'data-testid'?: string
}
export const IconButton: React.FC<IconButtonProps> = ({ icon, size = 36, type = 'round', className, ...rest }) => {
  return (
    <Button
      className={`icon-btn icon-btn-type-${type} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      flat
      icon={
        <Icon center style={{ fontSize: `${size * 0.7}px` }}>
          {icon}
        </Icon>
      }
      {...rest}
    />
  )
}
