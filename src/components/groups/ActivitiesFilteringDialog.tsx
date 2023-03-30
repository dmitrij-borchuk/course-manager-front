import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'
import { noop } from 'utils/common'

type Props = {
  open: boolean
  onClose?: () => void
  onSave?: (data: ActivitiesFilteringFormValues) => void
  filter?: ActivitiesFilteringFormValues
}
export function ActivitiesFilteringDialog({ open, onClose, onSave = noop, filter }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="common.filter" />
      </DialogTitle>

      <Box maxWidth="100%" width="100vw">
        <FilteringForm onSubmit={onSave} onClose={onClose} initialValues={filter} />
      </Box>
    </Dialog>
  )
}
export type ActivitiesFilteringFormValues = {
  showArchived: boolean
}

type FilteringFormProps = {
  onSubmit?: (data: ActivitiesFilteringFormValues) => void
  onClose?: () => void
  initialValues?: ActivitiesFilteringFormValues
}
function FilteringForm({ onSubmit = noop, onClose, initialValues }: FilteringFormProps) {
  const intl = useIntl()
  const form = useForm<ActivitiesFilteringFormValues>({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DialogContent>
        <Box width="100%" display="flex">
          <Controller
            control={form.control}
            name="showArchived"
            label={`${intl.formatMessage({ id: 'common.date' })} *`}
            render={({ value, ...renderProps }) => {
              return (
                <FormControlLabel
                  sx={{
                    width: '100%',
                    justifyContent: 'space-between',
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
                  labelPlacement="start"
                  label={<FormattedMessage id="groups.filtering.showArchived.inputLabel" />}
                />
              )
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage id="common.dialog.btn.cancel" />
        </Button>
        <Button type="submit" variant="contained">
          <FormattedMessage id="common.dialog.btn.save" />
        </Button>
      </DialogActions>
    </form>
  )
}
