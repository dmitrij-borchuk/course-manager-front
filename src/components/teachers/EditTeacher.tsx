import React from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'

type Teacher = {
  name: string
  email: string
  password?: string
  description?: string | null
}

type EditTeacherProps = {
  name: string
  email: string
  password: string
  description: string
}

interface Props {
  onSubmit: (data: EditTeacherProps) => void
  loading?: boolean
  className?: string
  initial?: Teacher
}
export const EditTeacher: React.FC<Props> = ({ className = '', onSubmit, loading = false, initial }) => {
  const intl = useIntl()
  const { control, handleSubmit } = useForm<Teacher>({
    defaultValues: {
      name: '',
      description: '',
      ...initial,
    },
  })
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
          />
          {/* TODO: disable when edit */}
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
            rules={{ required: true }}
            disabled={loading}
            password
          />
          <Input
            id="description"
            control={control}
            name="description"
            label={intl.formatMessage({ id: 'common.form.description.label' })}
            disabled={loading}
          />
        </FormLayout>
      </Container>
    </div>
  )
}
