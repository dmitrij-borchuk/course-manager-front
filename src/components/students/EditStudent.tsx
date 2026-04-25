import React, { useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '@/templates/FormLayout'
import { TagsEditor } from '../kit/tag/TagsEditor'
import { ExternalError, useFormWithError } from '../../hooks/useFormWithError'
import { useUpdateInitialForm } from '../../hooks/useUpdateInitialForm'
import { FormTextField } from '@/organisms/form'

export type StudentForm = {
  name: string
  tags: string[]
}

interface Props {
  onSubmit: (data: StudentForm) => void
  loading?: boolean
  disabled?: boolean
  isEdit?: boolean
  className?: string
  initial?: StudentForm
  error?: ExternalError<StudentForm>
}
export const EditStudent: React.FC<Props> = ({
  className = '',
  onSubmit,
  loading = false,
  disabled = false,
  isEdit = false,
  initial,
  error,
}) => {
  const intl = useIntl()
  const methods = useFormWithError<StudentForm>(
    {
      defaultValues: {
        name: '',
        tags: [],
        ...initial,
      },
    },
    error
  )
  const { control, handleSubmit, errors, setValue, watch, register } = methods

  const onTagsUpdate = useCallback(
    (newTags: string[]) => {
      setValue('tags', newTags)
    },
    [setValue]
  )

  const tags = watch('tags')

  useUpdateInitialForm(setValue, initial)
  register('tags')

  return (
    <div className={className}>
      <Container className="px-4">
        <FormLayout
          header={isEdit ? <FormattedMessage id="students.edit.title" /> : <FormattedMessage id="students.add.title" />}
          controls={<SubmitButton loading={loading} disabled={disabled} />}
          onSubmit={handleSubmit(onSubmit)}
          formUtils={methods}
        >
          {/* TODO: add autofocus */}
          <FormTextField
            id="name"
            name="name"
            label={`${intl.formatMessage({ id: 'common.form.name.label' })}`}
            required
            disabled={loading || disabled}
          />

          <TagsEditor loading={loading} disabled={disabled} value={tags} onUpdate={onTagsUpdate} />
        </FormLayout>
      </Container>
    </div>
  )
}
