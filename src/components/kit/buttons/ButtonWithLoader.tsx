import React from 'react'
import { Button, ButtonProps, Preloader } from 'react-materialize'
import './styles.css'

interface Props extends ButtonProps {
  loading?: boolean
}
export const ButtonWithLoader: React.FC<Props> = ({ className, loading = false, children, disabled, ...rest }) => {
  return (
    <Button waves="light" className={`button-with-loading ${className}`} disabled={disabled || loading} {...rest}>
      <div className="content">
        {loading && <Preloader color="red" flashing={false} size="small" data-testid="button-loader" />}
        {children}
      </div>
    </Button>
  )
}
