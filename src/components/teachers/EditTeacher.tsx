import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { useFormWithError } from '../../hooks/useFormWithError'
import { CustomError } from '../../types/error'

export type TeacherFormOutput = {
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
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: TeacherFormInput
  error?: CustomError
}
export const EditTeacher: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
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
          header={isEdit ? <FormattedMessage id="teachers.edit.title" /> : <FormattedMessage id="teachers.add.title" />}
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="name"
            control={control}
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })} *`}
            rules={{ required: true }}
            disabled={loading || disabled}
            error={errors['name']?.message}
          />
          <Input
            id="username"
            control={control}
            name="username"
            label={`${intl.formatMessage({ id: 'common.form.username.label' })} *`}
            rules={{ required: true }}
            disabled={loading || isEdit || disabled}
            error={errors['username']?.message}
          />
          <Input
            id="email"
            control={control}
            name="email"
            label={`${intl.formatMessage({ id: 'common.form.email.label' })} *`}
            rules={{ required: true }}
            disabled={loading || isEdit || disabled}
            error={errors['email']?.message}
          />
          {!isEdit && (
            <Input
              id="password"
              control={control}
              name="password"
              label={`${intl.formatMessage({ id: 'common.form.password.label' })} *`}
              rules={{ required: true }}
              disabled={loading || disabled}
              password
              error={errors['password']?.message}
            />
          )}
          {/* TODO: make text area */}
          <Input
            id="description"
            control={control}
            name="description"
            label={intl.formatMessage({ id: 'common.form.description.label' })}
            disabled={loading || disabled}
            error={errors['description']?.message}
          />
        </FormLayout>
      </Container>
    </div>
  )
}
