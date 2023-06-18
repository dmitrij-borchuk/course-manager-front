import { ReactNode, useCallback, useEffect, useState } from 'react'
import { CircularProgress, IconButton, TextField, Typography } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import { noop } from 'utils/common'

type TitleWithEditProps = {
  value?: string
  placeholder: ReactNode
  className?: string
  onSubmit?: (value: string) => void
}
export const TitleWithEdit = ({ value, placeholder, className, onSubmit = noop }: TitleWithEditProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState(value || '')
  const [submitting, setSubmitting] = useState(false)
  const title = value ? (
    <Typography className="truncate leading-normal mt-0" variant="h3">
      {value}
    </Typography>
  ) : (
    placeholder
  )
  const editor = (
    <TextField
      autoFocus
      value={newValue}
      disabled={submitting}
      variant="standard"
      InputProps={{
        inputProps: {
          className: 'browser-default !text-4xl !py-0',
        },
      }}
      onChange={(e) => setNewValue(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmitClick()
        }
      }}
    />
  )
  const onSubmitClick = useCallback(async () => {
    setSubmitting(true)
    try {
      await onSubmit(newValue)
      setIsEditing(false)
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      throw error
    }
  }, [newValue, onSubmit])
  const onCancelClick = useCallback(async () => {
    setIsEditing(false)
  }, [])
  const onDocumentKeydown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setIsEditing(false)
        setNewValue(value || '')
      }
    },
    [value]
  )

  useEffect(() => {
    document.addEventListener('keydown', onDocumentKeydown, false)

    return () => {
      document.removeEventListener('keydown', onDocumentKeydown, false)
    }
  }, [onDocumentKeydown])

  return (
    <div className={`flex w-full justify-between items-center ${className}`}>
      <div className="min-w-0">{isEditing ? editor : title}</div>
      <div className="mt-3">
        {isEditing ? (
          <>
            <IconButton key="cancel" size="large" aria-label="cancel" onClick={onCancelClick} disabled={submitting}>
              <CancelIcon />
            </IconButton>
            <IconButton key="done" size="large" aria-label="save" onClick={onSubmitClick} disabled={submitting}>
              {submitting ? <CircularProgress size={21} /> : <DoneIcon />}
            </IconButton>
          </>
        ) : (
          <IconButton key="edit" size="large" aria-label="edit" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}
      </div>
    </div>
  )
}
