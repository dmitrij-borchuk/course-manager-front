import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { useFormWithError } from '../../hooks/useFormWithError'
import { CustomError } from '../../types/error'

type TeacherFormOutput = {
  name: string
  username: string
  email: string
  password: string
  description?: string
}
type TeacherFormInput = Omit<TeacherFormOutput, 'password'>

interface Props {
  onSubmit: (data: TeacherFormOutput) => void
  loading?: boolean
  className?: string
  initial?: TeacherFormInput
  error?: CustomError
}
export const EditTeacher: React.FC<Props> = ({ className = '', onSubmit, loading = false, initial, error }) => {
  const intl = useIntl()
  const { control, handleSubmit, errors } = useFormWithError<TeacherFormOutput>(
    {
      defaultValues: {
        name: '',
        description: '',
        ...initial,
      },
    },
    error
  )
  // TODO: fix layout

  return (
    <div className={className}>
      <Header />
      <Container>
        <FormLayout
          header={<FormattedMessage id="teachers.add.title" />}
          controls={<SubmitButton loading={loading} />}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="name"
            control={control}
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
            error={errors['name']?.message}
          />
          {/* TODO: disable when edit */}
          <Input
            id="username"
            control={control}
            name="username"
            label={`${intl.formatMessage({ id: 'common.form.username.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
            error={errors['username']?.message}
          />
          {/* TODO: disable when edit */}
          <Input
            id="email"
            control={control}
            name="email"
            label={`${intl.formatMessage({ id: 'common.form.email.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
            error={errors['email']?.message}
          />
          <Input
            id="password"
            control={control}
            name="password"
            label={`${intl.formatMessage({ id: 'common.form.password.label' })} *`}
            rules={{ required: true }}
            disabled={loading}
            password
            error={errors['password']?.message}
          />
          <Input
            id="description"
            control={control}
            name="description"
            label={intl.formatMessage({ id: 'common.form.description.label' })}
            disabled={loading}
            error={errors['description']?.message}
          />
        </FormLayout>
      </Container>
    </div>
  )
}
