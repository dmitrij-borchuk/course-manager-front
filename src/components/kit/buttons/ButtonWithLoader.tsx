import React from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'
import './styles.css'

interface Props extends ButtonProps {
  loading?: boolean
}
export const ButtonWithLoader: React.FC<Props> = ({ loading = false, children, disabled, className, ...rest }) => {
  return (
    <Button variant="contained" disabled={disabled || loading} className={`button-with-loading ${className}`} {...rest}>
      <div className="content">
        {loading && <CircularProgress size={20} data-testid="button-loader" sx={{ mr: 1 }} />}
        {children}
      </div>
    </Button>
  )
}
