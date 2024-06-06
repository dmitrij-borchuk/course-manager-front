import { ReactNode } from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog'
import { noop } from '../../../utils/common'

interface Props {
  onSubmit?: () => void
  header?: string
  content?: ReactNode
}
export const DeleteIconWithDialog = ({ onSubmit = noop, header, content }: Props) => {
  return (
    <>
      <ConfirmationDialog
        onSubmit={onSubmit}
        title={header}
        confirmBtnProps={{
          variant: 'contained',
          color: 'error',
        }}
        trigger={({ openConfirmation }) => (
          <IconButton className="color-alert" onClick={openConfirmation}>
            <DeleteIcon />
          </IconButton>
        )}
      >
        {content}
      </ConfirmationDialog>
    </>
  )
}
