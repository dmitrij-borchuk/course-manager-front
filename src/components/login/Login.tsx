import { useForm } from 'react-hook-form'
import { Icon } from 'react-materialize'
import { UsersPermissionsLoginInput } from '../../api'
import { ButtonWithLoader } from '../kit/buttons/ButtonWithLoader'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

// TODO: translations

interface Props {
  onSubmit: (data: UsersPermissionsLoginInput) => void
  loading?: boolean
}
export const Login: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const { control, handleSubmit } = useForm<UsersPermissionsLoginInput>({
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  return (
    <div className="login-wrapper">
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
        <ButtonWithLoader loading={loading}>
          Submit
          <Icon right>send</Icon>
        </ButtonWithLoader>
      </form>
    </div>
  )
}
