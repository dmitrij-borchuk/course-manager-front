import React, { ComponentProps, ReactNode } from 'react'
import { Fab } from 'react-tiny-fab'
import './styles.css'

interface Props extends ComponentProps<typeof Fab> {
  icon?: ReactNode
}
export const FabBtn: React.FC<Props> = ({ children, icon }) => {
  return (
    <span className="fab-container z-50 relative">
      <Fab icon={icon || <i className="material-icons">add</i>} alwaysShowTitle={true}>
        {children}
      </Fab>
    </span>
  )
}
