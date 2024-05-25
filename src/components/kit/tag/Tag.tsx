import React, { MouseEventHandler } from 'react'
import { Icon } from 'react-materialize'

interface Props {
  className?: string
  onClose?: () => void
  onClick?: MouseEventHandler<HTMLDivElement>
  children?: React.ReactNode
}
export const Tag: React.FC<Props> = ({ children, className, onClose, onClick }) => {
  return (
    <div
      className={`break-words border-gray-300 border border-solid rounded px-2 inline-block max-w-full ${className}`}
      onClick={onClick}
      data-testid="tag-container"
    >
      {children}
      {onClose && (
        <Icon className="close cursor-pointer text-base align-text-top color-text-gray ml-1" onClick={() => onClose()}>
          close
        </Icon>
      )}
    </div>
  )
}
