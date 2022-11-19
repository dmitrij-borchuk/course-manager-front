import { useCallback } from 'react'
import { useStudentsState } from '../../store'
import { ButtonWithLoader } from '../../components/kit/buttons/ButtonWithLoader'
import { useNotification } from '../../hooks/useNotification'

export const StudentsMigration = () => {
  const { migrate, submitting } = useStudentsState()
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
      Migrate students
    </ButtonWithLoader>
  )
}
