import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { SubmitButton } from 'components/kit/buttons/SubmitButton'
import { ROUTES } from '../../constants'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

// TODO: translations

interface FormData {
  email: string
}
interface Props {
  onSubmit: (data: FormData) => void
  loading?: boolean
}
export const ResetPassword: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
  })

  return (
    <Container>
      <div className="auth-form-wrapper m-auto">
        {/* TODO: translate */}
        <SectionHeader>Reset Password</SectionHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            control={control}
            name="email"
            label="Email *"
            rules={{ required: true }}
            disabled={loading}
          />
          <div className="flex justify-end">
            <SubmitButton loading={loading}>
              {/* TODO: translate */}
              Submit
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
          <Link to={`${ROUTES.LOGIN}`}>
            <FormattedMessage id="auth.loginLink.title" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
