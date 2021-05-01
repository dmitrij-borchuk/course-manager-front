import React from 'react'
import { Preloader } from 'react-materialize'
import './styles.css'

interface Props {
  className?: string
}
export const TinyPreloader = ({ className }: Props) => {
  return (
    <div className={`tiny-preloader ${className}`}>
      <Preloader color="red" flashing={false} size="small" />
    </div>
  )
}
