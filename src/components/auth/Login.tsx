import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { Container, Icon } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

// TODO: translations

interface FormData {
  identifier: string
  password: string
}
interface Props {
  onSubmit: (data: FormData) => void
  loading?: boolean
}
export const Login: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const orgId = useOrgIdNotStrict()
  const orgPrefix = orgId ? `/${orgId}` : ''
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  return (
    <Container>
      <div className="auth-form-wrapper m-auto">
        {/* TODO: translate */}
        <SectionHeader>Login</SectionHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="identifier"
            control={control}
            name="identifier"
            label="Login *"
            rules={{ required: true }}
            disabled={loading}
          />
          <Input
            id="password"
            control={control}
            name="password"
            label="Password *"
            password
            rules={{ required: true }}
            disabled={loading}
          />

          {/* Password reset */}
          <Link to={`${orgPrefix}${ROUTES.RESET}`}>
            <FormattedMessage id="auth.resetLink.label" />
          </Link>

          {/* Submit */}
          <div className="flex justify-end">
            <ButtonWithLoader loading={loading} data-testid="submit">
              {/* TODO: translate */}
              Submit
              <Icon right>send</Icon>
            </ButtonWithLoader>
          </div>
        </form>
        <div className="flex flex-col items-center mt-8 gap-3">
          {/* Can't register inside of organization */}
          {!orgId && (
            <>
              {/* Separator */}
              <div className="flex w-full items-center gap-2">
                <div className="h-px bg-gray-400 w-full" />
                <div className="-mt-1">
                  <FormattedMessage id="auth.registerLink.separator" />
                </div>
                <div className="h-px bg-gray-400 w-full" />
              </div>

              {/* Link */}
              <Link to={`${ROUTES.REGISTER}`} role="link">
                <FormattedMessage id="auth.registerLink.label" />
              </Link>
            </>
          )}
        </div>
      </div>
    </Container>
  )
}
