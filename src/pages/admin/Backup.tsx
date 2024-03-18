import { Container, Typography } from '@mui/material'
import { ButtonWithLoader } from 'components/kit/buttons/ButtonWithLoader'
import { TITLE_POSTFIX } from 'config'
import { runBackup } from 'modules/admin/api'
import { Helmet } from 'react-helmet-async'
import { useMutation } from 'react-query'

export function Backup() {
  return (
    <Container>
      <Helmet>
        <title>Admin{TITLE_POSTFIX}</title>
      </Helmet>
      <Typography variant="h1">Backup</Typography>

      <BackupBtn />
    </Container>
  )
}
export default Backup

function BackupBtn() {
  const { data, error, isError, isLoading, mutate } = useBackup()

  return (
    <>
      <ButtonWithLoader onClick={() => mutate()} loading={isLoading}>
        Make backup
      </ButtonWithLoader>
      <br />
      {isError && JSON.stringify(error)}
      <Typography>Dump is saved. You can download if you want.</Typography>

      <a href={data?.data || ''}>Download dump</a>
    </>
  )
}

function useBackup() {
  return useMutation(() => runBackup())
}
