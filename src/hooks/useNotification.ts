import { enqueueSnackbar } from 'notistack'
import { ReactNode, useCallback } from 'react'

export function useNotification() {
  return {
    showError: useCallback((content: ReactNode) => {
      enqueueSnackbar(content, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    }, []),
    showSuccess: useCallback((content: ReactNode) => {
      enqueueSnackbar(content, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    }, []),
  }
}
