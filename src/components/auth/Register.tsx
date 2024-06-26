import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Link, useHistory } from 'react-router-dom'
import { SubmitButton } from 'components/kit/buttons/SubmitButton'
import { ROUTES } from '../../constants'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

interface FormData {
  name: string
  email: string
  password: string
}
interface Props {
  onSubmit: (data: FormData) => void
  loading?: boolean
}
export const Register: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const history = useHistory()
  const redirect = new URLSearchParams(history.location.search).get('redirect') ?? ''
  const redirectPath = redirect ? `?redirect=${redirect}` : ''
  const intl = useIntl()
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  return (
    <Container>
      <div className="auth-form-wrapper m-auto">
        <SectionHeader>
          <FormattedMessage id="auth.register.title" />
        </SectionHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            control={control}
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
          />
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
            <SubmitButton loading={loading} data-testid="submit">
              <FormattedMessage id="common.submitLabel" />
            </SubmitButton>
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
          <Link to={`${ROUTES.LOGIN}${redirectPath}`} role="link">
            <FormattedMessage id="auth.loginLink.title" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
