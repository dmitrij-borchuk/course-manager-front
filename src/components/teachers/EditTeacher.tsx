import React from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { Header } from '../kit/header/Header'
import { Input } from '../kit/input/Input'
import { UserInput } from '../../api'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'

interface Props {
  onSubmit: (data: UserInput) => void
  loading?: boolean
  className?: string
}
export const EditTeacher: React.FC<Props> = ({ className = '', onSubmit, loading = false }) => {
  const intl = useIntl()
  const { control, handleSubmit } = useForm<UserInput>({
    defaultValues: {
      name: '',
      description: '',
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
