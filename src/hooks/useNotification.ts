import { ReactNode, useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'

export function useNotification() {
  const { addToast } = useToasts()

  return {
    showError: useCallback(
      (content: ReactNode) => {
        addToast(content, {
          appearance: 'error',
          autoDismiss: true,
        })
      },
      [addToast]
    ),
    showSuccess: useCallback(
      (content: ReactNode) => {
        addToast(content, {
          appearance: 'success',
          autoDismiss: true,
        })
      },
      [addToast]
    ),
  }
}
