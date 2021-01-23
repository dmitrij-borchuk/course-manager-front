import React from 'react'
import { Button, ButtonProps, Preloader } from 'react-materialize'
import './styles.css'

interface Props extends ButtonProps {
  loading?: boolean
}
export const ButtonWithLoader: React.FC<Props> = ({ loading = false, children, disabled, ...rest }) => {
  return (
    <Button waves="light" className="button-with-loading" disabled={disabled || loading} {...rest}>
      <div className="content">
        {loading && <Preloader color="red" flashing={false} size="small" />}
        {children}
      </div>
    </Button>
  )
}
