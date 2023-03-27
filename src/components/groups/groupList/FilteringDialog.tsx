import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'
import { noop } from 'utils/common'

type FilteringDialogProps = {
  open: boolean
  onClose?: () => void
  onSave?: (data: FormValues) => void
}
export function FilteringDialog({ open, onClose, onSave = noop }: FilteringDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="common.filter" />
      </DialogTitle>

      <DialogContent>
        <FilteringForm onSubmit={onSave} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage id="common.dialog.btn.cancel" />
        </Button>
        <Button type="submit" variant="contained">
          <FormattedMessage id="common.dialog.btn.save" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
type FormValues = {
  showArchived: boolean
}

type FilteringFormProps = {
  onSubmit?: (data: FormValues) => void
}
function FilteringForm({ onSubmit = noop }: FilteringFormProps) {
  const intl = useIntl()
  const form = useForm<FormValues>({
    defaultValues: {
      showArchived: false,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="showArchived"
        label={`${intl.formatMessage({ id: 'common.date' })} *`}
        render={({ value, ...renderProps }) => {
          return (
            <FormControlLabel
              sx={{
                display: 'block',
              }}
              control={
                <Switch
                  checked={value}
                  color="primary"
                  // To remove MaterializeCSS styles
                  classes={{ thumb: 'lever' }}
                  {...renderProps}
                  onChange={(v) => {
                    renderProps.onChange(v.target.checked)
                  }}
                />
              }
              label={<FormattedMessage id="groups.filtering.showArchived.inputLabel" />}
            />
          )
        }}
      />
    </form>
  )
}
