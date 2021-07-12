import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container, Icon } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

interface FormData {
  email: string
  password: string
}
interface Props {
  onSubmit: (data: FormData) => void
  loading?: boolean
}
export const Register: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const orgId = useOrgId()
  const orgPrefix = orgId ? `/${orgId}` : ''
  const intl = useIntl()
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Container>
      <div className="login-wrapper m-auto">
        <SectionHeader>
          <FormattedMessage id="auth.register.title" />
        </SectionHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            control={control}
            name="email"
            label={`${intl.formatMessage({ id: 'common.form.email.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
          />
          <Input
            id="password"
            control={control}
            name="password"
            label={`${intl.formatMessage({ id: 'common.form.password.label' })} *`}
            password
            rules={{ required: true }}
            disabled={loading}
          />
          <div className="flex justify-end">
            <ButtonWithLoader loading={loading}>
              <FormattedMessage id="common.submitLabel" />
              <Icon right>send</Icon>
            </ButtonWithLoader>
          </div>
        </form>
        <div className="flex flex-col items-center mt-8 gap-3">
          <div className="flex w-full items-center gap-2">
            <div className="h-px bg-gray-400 w-full" />
            <div className="-mt-1">
              <FormattedMessage id="auth.loginLink.separator" />
            </div>
            <div className="h-px bg-gray-400 w-full" />
          </div>
          <Link to={`${orgPrefix}${ROUTES.LOGIN}`}>
            <FormattedMessage id="auth.loginLink.title" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
