import React from 'react'
import { Button, ButtonProps, Icon } from 'react-materialize'
import './styles.css'

interface Props extends ButtonProps {
  icon: string
  size?: number
  type?: 'round' | 'square'
}
export const IconButton: React.FC<Props> = ({ icon, size = 36, type = 'round', className, ...rest }) => {
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
