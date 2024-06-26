import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox, Container, Select, TextInput } from 'react-materialize'
import { Controller } from 'react-hook-form'
import csv from 'csvtojson'
import { SubmitButton } from '../../../components/kit/buttons/SubmitButton'
import { useFormWithError } from '../../../hooks/useFormWithError'
import { FormLayout } from '../../../components/kit/formLayout/FormLayout'
import { Input } from '../../../components/kit/input/Input'
import { useToasts } from 'react-toast-notifications'
import { StudentImport } from '../../../types/student'
import { Text } from '../../../components/kit/text/Text'
import { useStudentsState } from '../../../store'
import { Message } from '../../../components/kit/message/Message'

export const StudentsImport = () => {
  const intl = useIntl()
  const { addToast } = useToasts()
  const [reading, setReading] = useState(false)
  const [previewData, setPreviewData] = useState<StudentImport[] | null>(null)
  const { createStudent, submitting } = useStudentsState()
  const [processed, setProcessed] = useState(0)
  const loading = submitting || reading
  const { control, handleSubmit, setValue, watch, register } = useFormWithError<ImportStudentsForm>({
    defaultValues: {
      fileType: 'json',
      file: '',
      nameColumn: '',
      tagsColumn: '',
      emailColumn: '',
      isMultipleTags: false,
    },
  })
  const fileType = watch('fileType')
  const onSubmit = useCallback(
    async (d: ImportStudentsForm) => {
      setReading(true)
      try {
        const textData = (await d.file?.text()) ?? ''
        const data = await fromFileToJson(fileType, textData)
        const { nameColumn, tagsColumn, isMultipleTags, emailColumn } = d

        if (!data.every((item) => item[d.nameColumn])) {
          addToast(intl.formatMessage({ id: 'import.parse.emptyName' }, { column: d.nameColumn }), {
            appearance: 'error',
            autoDismiss: true,
          })
        } else {
          setPreviewData(
            fromJsonToData(fileType, data, {
              isMultipleTags,
              nameColumn,
              tagsColumn,
              emailColumn,
            })
          )
        }
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
      setReading(false)
    },
    [addToast, fileType, intl]
  )
  const processStudent = useCallback(
    async (element: StudentImport) => {
      await createStudent(element)
      setProcessed((p) => p + 1)
    },
    [createStudent]
  )
  const onSaveList = useCallback(async () => {
    if (!previewData) {
      return
    }
    try {
      for (let index = 0; index < previewData.length; index++) {
        const element = previewData[index]

        processStudent(element)
      }
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, previewData, processStudent])
  const processedEl = processed ? (
    <>
      {processed}/{previewData?.length}
    </>
  ) : (
    <></>
  )

  useEffect(() => {
    if (processed === previewData?.length) {
      addToast(intl.formatMessage({ id: 'import.submitting.success' }), {
        appearance: 'success',
        autoDismiss: true,
      })
    }
  }, [addToast, intl, previewData?.length, processed])

  useEffect(() => {
    register('fileType')
  }, [register])

  return (
    <Container className="px-4">
      <FormLayout
        header={<FormattedMessage id="import.student.header" />}
        controls={<SubmitButton loading={loading} children={<FormattedMessage id="import.form.read" />} />}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* File type */}
        <Select
          id="source-selector"
          multiple={false}
          options={{
            dropdownOptions: {
              alignment: 'left',
              autoTrigger: true,
              closeOnClick: true,
              constrainWidth: true,
              coverTrigger: true,
              hover: false,
              inDuration: 150,
              outDuration: 250,
            },
          }}
          onChange={(e) => setValue('fileType', e.target.value)}
          value={fileType}
          name={'fileType'}
        >
          {fileTypes.map((type) => (
            <option key={type} value={type}>
              {intl.formatMessage({ id: `import.fileType.${type}` })}
            </option>
          ))}
        </Select>

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
                accept={`.${fileType}`}
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

        {/* Email column */}
        <Input
          id="emailColumn"
          control={control}
          name="emailColumn"
          label={`${intl.formatMessage({ id: 'import.student.email.label' })}`}
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
              disabled={fileType === 'json'}
              value={fileType === 'json' ? true : value && value.toString()}
              checked={fileType === 'json' ? true : value && value.toString()}
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
                <FormattedMessage id="import.student.email" />
              </td>
              <td>
                <FormattedMessage id="import.student.tags" />
              </td>
            </thead>
            <tbody>
              {previewData.map((d) => (
                <tr>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
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
  fileType: string
  file: File | null
  nameColumn: string
  emailColumn: string
  tagsColumn: string
  isMultipleTags: boolean
}

const fileTypes = ['json', 'csv']

async function fromFileToJson(type: string, data: string): Promise<any[]> {
  if (type === 'csv') {
    return await csv().fromString(data)
  }

  // JSON
  return JSON.parse(data)
}

interface Config {
  nameColumn: string
  tagsColumn: string
  emailColumn: string
  isMultipleTags: boolean
}
function fromJsonToData(type: string, data: any, config: Config): StudentImport[] {
  const { isMultipleTags, nameColumn, tagsColumn, emailColumn } = config

  return data.map((item: any) => ({
    name: item[nameColumn],
    tags: type === 'csv' ? parseCsvTags(item[tagsColumn], isMultipleTags) : item[tagsColumn],
    email: item[emailColumn],
  }))
}

function parseCsvTags(tagsStr: string, isMultipleTags: boolean): string[] {
  return isMultipleTags ? tagsStr.split(',').filter((t) => t.length > 0) : [tagsStr]
}
