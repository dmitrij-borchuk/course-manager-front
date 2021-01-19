import { useForm } from 'react-hook-form'
import { Input } from '../kit/input/Input'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import './styles.css'

// TODO: translations

interface Props {
  onSubmit: () => void
}
export const Login: React.FC<Props> = ({ onSubmit }) => {
  const { control, handleSubmit, errors } = useForm()

  return (
    <div className="login-wrapper">
      <SectionHeader text="Login" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input control={control} name="login" label="Login *" rules={{ required: true }} />
        <Input control={control} name="password" label="Password *" rules={{ required: true }} />
      </form>
    </div>
  )
}
