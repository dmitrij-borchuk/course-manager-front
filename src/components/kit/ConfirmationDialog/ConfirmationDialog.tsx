import { ReactNode, useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { noop } from '../../../utils/common'

interface ConfirmationDialogProps extends ConfirmationDialogBaseProps {
  trigger: (props: { openConfirmation: () => void }) => ReactNode
}
export const ConfirmationDialog = ({ trigger, ...props }: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {trigger({ openConfirmation: () => setOpen(true) })}
      <ConfirmationDialogBase onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

interface ConfirmationDialogBaseProps {
  title?: ReactNode
  children?: ReactNode
  onSubmit?: () => void
  open?: boolean
  onClose?: () => void
  cancelBtnProps?: React.ComponentProps<typeof Button>
  confirmBtnProps?: React.ComponentProps<typeof LoadingButton>
}
export const ConfirmationDialogBase = ({
  onSubmit = noop,
  onClose = noop,
  title,
  children,
  open = false,
  confirmBtnProps,
  cancelBtnProps,
}: ConfirmationDialogBaseProps) => {
  const [loading, setLoading] = useState(false)
  const onSubmitClick = useCallback(async () => {
    setLoading(true)
    try {
      await onSubmit()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [onSubmit])

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="confirmation-dialog-title">
        {title && <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            data-testid="dialog-btn-no"
            {...cancelBtnProps}
          >
            <FormattedMessage id="common.dialog.btn.no" />
          </Button>
          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={onSubmitClick}
            data-testid="dialog-btn-yes"
            {...confirmBtnProps}
          >
            <FormattedMessage id="common.dialog.btn.yes" />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
