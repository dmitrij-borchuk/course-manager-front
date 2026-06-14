import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '@/templates/FormLayout'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'
import { FormTextField } from '../organisms/form'
import { Flex } from '@/atoms/layout'

export type OrganizationForm = {
  key: string
  name: string
}

interface Props {
  onSubmit: (data: OrganizationForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: OrganizationForm
  error?: ExternalError<OrganizationForm>
}
export const EditOrganization: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
  const intl = useIntl()
  const formUtils = useFormWithError<OrganizationForm>(
    {
      defaultValues: {
        key: '',
        name: '',
        ...initial,
      },
    },
    error
  )
  const { handleSubmit, setValue } = formUtils

  useUpdateInitialForm(setValue, initial)

  return (
    <div className={className}>
      <FormLayout
        header={
          isEdit ? (
            <FormattedMessage id="organizations.edit.title" />
          ) : (
            <FormattedMessage id="organizations.add.title" />
          )
        }
        controls={<SubmitButton loading={loading} disabled={disabled} />}
        // @ts-expect-error todo: fix this
        onSubmit={handleSubmit(onSubmit)}
        formUtils={formUtils}
      >
        <Flex column gap={2}>
          <FormTextField
            id="key"
            name="key"
            label={`${intl.formatMessage({ id: 'common.form.id.label' })}`}
            required
            disabled={loading || disabled}
          />
          <FormTextField
            id="name"
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })}`}
            required
            disabled={loading || disabled}
          />
        </Flex>
      </FormLayout>
    </div>
  )
}
