import Alert, { AlertProps } from '@mui/material/Alert'
import React from 'react'

type MessageType = 'success' | 'error' | 'info' | 'warning'
interface Props extends AlertProps {
  type?: MessageType
}
export const Message: React.FC<Props> = ({ children, type }) => {
  return <Alert severity={type}>{children}</Alert>
}
