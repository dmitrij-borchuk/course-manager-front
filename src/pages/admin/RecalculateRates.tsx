import { useState } from 'react'
import { useStudentsState } from 'store'
import { useNotification } from 'hooks/useNotification'
import { ButtonWithLoader } from 'components/kit/buttons/ButtonWithLoader'
import { Box, TextField } from '@mui/material'

export function RecalculateRates() {
  const { recalculateRates } = useStudentsState()
  const [loading, setLoading] = useState(false)
  const [orgName, setOrgName] = useState('')
  const { showError, showSuccess } = useNotification()
  const onClick = async () => {
    try {
      setLoading(true)
      const result = await recalculateRates(orgName)
      showSuccess(result.data)
    } catch (error: any) {
      showError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box gap={2} display="flex" alignItems="center">
      <TextField
        inputProps={{
          className: `browser-default`,
        }}
        variant="standard"
        onChange={(e) => setOrgName(e.target.value)}
        value={orgName}
        label="Organization name"
      />
      <ButtonWithLoader onClick={onClick} loading={loading}>
        Recalculate rates
      </ButtonWithLoader>
    </Box>
  )
}
