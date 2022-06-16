import { useCallback } from 'react'
import { useUsersState } from '../../store'
import { ButtonWithLoader } from '../../components/kit/buttons/ButtonWithLoader'
import { useNotification } from '../../hooks/useNotification'

export const UsersMigration = () => {
  const { migrate, submitting } = useUsersState()
  const { showError, showSuccess } = useNotification()
  const onMigrateClick = useCallback(async () => {
    try {
      const result = await migrate()
      showSuccess(result.data)
    } catch (error: any) {
      showError(error.message)
    }
  }, [migrate, showError, showSuccess])

  return (
    <ButtonWithLoader onClick={onMigrateClick} loading={submitting}>
      Migrate users
    </ButtonWithLoader>
  )
}
