import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useNotification } from 'hooks/useNotification'
import { useUnassignForActivity } from 'store/studentsOfGroupStore'
import { Identified } from 'types/identified'
import { Named } from 'types/named'

type UnassignDialogProps = {
  activity?: Identified & Named
  participant?: Identified & Named
  onDone: () => void
  onCancel: () => void
}
export function UnassignDialog({ activity, participant, onCancel, onDone }: UnassignDialogProps) {
  const [reason, setReason] = useState('')
  const unassign = useUnassignForActivity()
  const unassignMutation = unassign.mutateAsync
  const { showError, showSuccess } = useNotification()
  const removeActivity = useCallback(
    async (activityId: number, participantId: number, reason: string) => {
      try {
        await unassignMutation({ activityId, participantId, leaveReasonComment: reason })
        showSuccess(<FormattedMessage id="groups.unassignStudents.success" />)
        onDone()
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message)
        } else {
          showError('An unknown error occurred')
        }
      } finally {
      }
    },
    [onDone, showError, showSuccess, unassignMutation]
  )

  return (
    <Dialog open={!!activity && !!participant}>
      {activity && participant && (
        <>
          <DialogTitle>
            <FormattedMessage
              id="groups.unassignStudents.confirmation.title"
              values={{ name: activity.name, participant: participant.name }}
            />
          </DialogTitle>
          <DialogContent>
            <Box pt={2}>
              <TextField
                label={<FormattedMessage id="groups.unassignStudents.comment.title" />}
                onChange={(e) => setReason(e.target.value)}
                disabled={unassign.isLoading}
                value={reason}
                multiline
                fullWidth
                autoFocus
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onCancel()} disabled={unassign.isLoading}>
              <FormattedMessage id="common.dialog.btn.cancel" />
            </Button>
            <LoadingButton
              color="error"
              onClick={() => removeActivity(activity.id, participant.id, reason)}
              loading={unassign.isLoading}
            >
              <FormattedMessage id="common.remove" />
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
