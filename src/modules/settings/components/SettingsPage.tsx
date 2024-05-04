import { FormattedMessage } from 'react-intl'
import { useMutation } from 'react-query'
import { Box, TextField } from '@mui/material'
import Alert from '@mui/material/Alert'
import { GeneralPage } from 'components/layouts/GeneralPage'
import { ButtonWithLoader } from 'components/kit/buttons/ButtonWithLoader'
import { generateApiKey } from '../api/security'

export function SettingsPage() {
  const { data, mutate, isLoading } = useMutation('apiKey', () => {
    return generateApiKey()
  })

  return (
    <>
      <GeneralPage title="Settings">
        <Box display="flex" flexDirection="column" gap={2}>
          <Alert severity="info">
            <FormattedMessage id="settings.apiKey.info" />
          </Alert>
          <TextField
            label={<FormattedMessage id="settings.apiKey.keyField.label" />}
            InputProps={{ readOnly: true }}
            minRows={2}
            value={data?.data ?? ''}
            multiline
            fullWidth
          />
          <Box>
            <ButtonWithLoader onClick={() => mutate()} loading={isLoading}>
              <FormattedMessage id="settings.apiKey.generateBtn.label" />
            </ButtonWithLoader>
          </Box>
        </Box>
      </GeneralPage>
    </>
  )
}
