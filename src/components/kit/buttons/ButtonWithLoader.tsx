import React from 'react'
import { Button, ButtonProps } from 'react-materialize'
import { CircularProgress } from '@mui/material'
import './styles.css'

interface Props extends ButtonProps {
  loading?: boolean
}
export const ButtonWithLoader: React.FC<Props> = ({ className, loading = false, children, disabled, ...rest }) => {
  return (
    <Button waves="light" className={`button-with-loading ${className}`} disabled={disabled || loading} {...rest}>
      <div className="content">
        {loading && <CircularProgress size={20} data-testid="button-loader" sx={{ mr: 1 }} />}
        {children}
      </div>
    </Button>
  )
}
