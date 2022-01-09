import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Container, TextInput } from 'react-materialize'
import { Controller } from 'react-hook-form'
import csv from 'csvtojson'
import { SubmitButton } from '../../../components/kit/buttons/SubmitButton'
import { useFormWithError } from '../../../hooks/useFormWithError'
import { FormLayout } from '../../../components/kit/formLayout/FormLayout'
import { Input } from '../../../components/kit/input/Input'
import { useToasts } from 'react-toast-notifications'
import { StudentBase } from '../../../types/student'
import { Text } from '../../../components/kit/text/Text'
import { useStudentsState } from '../../../store'
import { useOrgId } from '../../../hooks/useOrgId'
import { Message } from '../../../components/kit/message/Message'

export const StudentsImport = () => {
  const intl = useIntl()
  const orgId = useOrgId()
  const { addToast } = useToasts()
  const [reading, setReading] = useState(false)
  const [previewData, setPreviewData] = useState<StudentBase[] | null>(null)
  const { createStudent, submitting } = useStudentsState()
  const [processed, setProcessed] = useState(0)
  const loading = submitting || reading
  const { control, handleSubmit } = useFormWithError<ImportStudentsForm>({
    defaultValues: {
      file: '',
      nameColumn: 'Please, indicate your name and last name',
      tagsColumn: 'Select your branch',
      isMultipleTags: false,
    },
  })
  const onSubmit = useCallback(
    async (d) => {
      setReading(true)
      try {
        const textData = await d.file.text()
        const data = await csv().fromString(textData)
        const { nameColumn, tagsColumn, isMultipleTags } = d
        setPreviewData(
          data.map((item) => ({
            name: item[nameColumn],
            tags: isMultipleTags ? item[tagsColumn].split(',') : [item[tagsColumn]],
          }))
        )

        if (!data.every((item) => item[d.nameColumn])) {
          addToast(intl.formatMessage({ id: 'import.parse.emptyName' }, { column: d.nameColumn }), {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
      setReading(false)
    },
    [addToast, intl]
  )
  const onSaveList = useCallback(async () => {
    if (!previewData) {
      return
    }
    try {
      for (let index = 0; index < previewData.length; index++) {
        const element = previewData[index]

        await createStudent(orgId, element)
        setProcessed(index)
      }

      addToast(intl.formatMessage({ id: 'import.submitting.success' }), {
        appearance: 'success',
        autoDismiss: true,
      })
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, createStudent, intl, orgId, previewData])
  const processedEl = processed ? (
    <>
      {processed}/{previewData?.length}
    </>
  ) : (
    <></>
  )

  return (
    <Container className="px-4">
      <FormLayout
        header={<FormattedMessage id="import.student.header" />}
        controls={<SubmitButton loading={loading} children={<FormattedMessage id="import.form.read" />} />}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* File */}
        <Controller
          control={control}
          name="file"
          defaultValue={null}
          rules={{ required: true }}
          render={({ onChange, value, ...renderProps }) => {
            return (
              <TextInput
                type="file"
                // @ts-ignore
                accept=".csv"
                label={`${intl.formatMessage({ id: 'import.student.file.label' })} *`}
                onChange={(e) => {
                  const files = e.target.files || []
                  const file = files[0]
                  onChange(file)
                }}
                {...renderProps}
              />
            )
          }}
        />

        {/* Name column */}
        <Input
          id="nameColumn"
          control={control}
          name="nameColumn"
          label={`${intl.formatMessage({ id: 'import.student.name.label' })} *`}
          rules={{ required: true }}
          disabled={loading}
        />

        {/* Tags column */}
        <Input
          id="tagsColumn"
          control={control}
          name="tagsColumn"
          label={`${intl.formatMessage({ id: 'import.student.tags.label' })} *`}
          rules={{ required: true }}
          disabled={loading}
        />

        {/* Is multiple tags */}
        <Controller
          control={control}
          name="isMultipleTags"
          defaultValue={null}
          render={({ onChange, value, ...renderProps }) => (
            <Checkbox
              label={intl.formatMessage({ id: 'import.student.tags.isMultiple.label' })}
              onChange={(e: any) => {
                onChange(!!e.target.checked)
              }}
              value={value && value.toString()}
              {...renderProps}
            />
          )}
        />
      </FormLayout>

      {previewData && (
        <div className="mb-8">
          <Message type="success">
            <FormattedMessage id="import.parse.success" />
          </Message>
          <Text type="h4">
            <FormattedMessage id="import.preview.header" />
          </Text>
          <table>
            <thead>
              <td>
                <FormattedMessage id="import.student.name" />
              </td>
              <td>
                <FormattedMessage id="import.student.tags" />
              </td>
            </thead>
            <tbody>
              {previewData.map((d) => (
                <tr>
                  <td>{d.name}</td>
                  <td>{d.tags?.join(',')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Submit the result */}
          <div className="flex justify-end mt-4">
            <SubmitButton
              loading={loading}
              children={
                <>
                  <FormattedMessage id="common.submitLabel" /> {processedEl}
                </>
              }
              onSubmit={onSaveList}
            />
          </div>
        </div>
      )}
    </Container>
  )
}

export default StudentsImport

interface ImportStudentsForm {
  file: File | null
  nameColumn: string
  tagsColumn: string
  isMultipleTags: boolean
}
