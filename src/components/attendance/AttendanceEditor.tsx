import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container, DatePicker, Icon, Preloader, Select } from 'react-materialize'
import { useFormWithError } from '../../hooks/useFormWithError'
import { Attendance } from '../../types/attendance'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { OrganizationUser } from '../../types/user'
import { noop } from '../../utils/common'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'

type AttendanceForm = {
  date: Date
  group: string
  selected: Dictionary<boolean>
}
interface Props {
  className?: string
  currentGroup?: Group
  groups: Group[]
  onSubmit?: (data: AttendanceForm) => void
  onGroupChanged?: (id: string) => void
  students: Student[]
  studentsLoading?: boolean
  submitting?: boolean
  attendance?: Attendance
  teacher?: OrganizationUser
}
export const AttendanceEditor = (props: Props) => {
  const {
    className,
    groups,
    students,
    onSubmit = noop,
    submitting = false,
    attendance,
    onGroupChanged = noop,
    studentsLoading = false,
    teacher,
  } = props
  const intl = useIntl()
  const { control, handleSubmit, errors, watch } = useFormWithError<AttendanceForm>({
    defaultValues: {
      ...attendance,
      group: attendance?.group || '',
      date: attendance?.date ? new Date(attendance.date) : new Date(),
    },
    reValidateMode: 'onChange',
  })
  const [selected, setSelected] = useState<Dictionary<boolean>>({})
  const onSubmitInternal = useCallback(
    (data) => {
      onSubmit({
        ...data,
        selected,
      })
    },
    [onSubmit, selected]
  )
  const onStudentsChanged = useCallback((attendance: Dictionary<boolean>) => {
    setSelected(attendance)
  }, [])
  const group = watch('group')

  useEffect(() => {
    onGroupChanged(group)
  }, [group, onGroupChanged])

  return (
    <div className={className}>
      <Container className="px-4">
        <FormLayout
          header={<FormattedMessage id={attendance ? 'attendance.header.edit' : 'attendance.header.add'} />}
          controls={<SubmitButton loading={submitting} disabled={submitting || studentsLoading} />}
          onSubmit={handleSubmit(onSubmitInternal)}
        >
          {/* Teacher */}
          <div className="mb-12">
            <Text type="h4">{teacher?.name}</Text>
          </div>

          <div>
            {/* TODO: move to component */}
            {/* Date */}
            <Controller
              id="date"
              control={control}
              name="date"
              label={`${intl.formatMessage({ id: 'common.date' })} *`}
              rules={{
                required: {
                  value: true,
                  message: 'Required',
                },
              }}
              render={({ value, ...renderProps }, ddd) => {
                return (
                  <DatePicker
                    id="date"
                    options={{
                      autoClose: true,
                      format: 'mmm dd, yyyy',
                      defaultDate: value,
                      setDefaultDate: true,
                    }}
                    // @ts-ignore
                    label={`${intl.formatMessage({ id: 'common.date' })} *`}
                    disabled={submitting}
                    {...renderProps}
                  />
                )
              }}
            />
          </div>

          <Controller
            id="group"
            control={control}
            name="group"
            // label={`${intl.formatMessage({ id: 'attendance.groupSelector.placeholder' })} *`}
            rules={{
              required: {
                value: true,
                message: 'Required',
              },
            }}
            render={({ ...renderProps }) => {
              const error = errors['group']?.message
              const validationClass = error ? 'invalid' : ''

              return (
                <Select
                  id="group-selector"
                  multiple={false}
                  options={{
                    classes: validationClass,
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
                  error={error}
                  className={validationClass}
                  {...renderProps}
                >
                  <option disabled value="">
                    {intl.formatMessage({ id: 'attendance.groupSelector.placeholder' })}
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Select>
              )
            }}
          />

          {studentsLoading && (
            <div className="flex justify-center">
              <Preloader color="red" flashing={false} size="medium" />
            </div>
          )}

          <StudentsSelector students={students} onChange={onStudentsChanged} initialSelected={attendance?.attended} />
        </FormLayout>
      </Container>
    </div>
  )
}

export default AttendanceEditor

interface StudentsSelectorProps {
  students: Student[]
  initialSelected?: Dictionary<boolean>
  onChange?: (attendance: Dictionary<boolean>) => void
}
const StudentsSelector = ({ students, onChange = noop, initialSelected }: StudentsSelectorProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>(initialSelected || {})
  const onClick = useCallback((id: string, value: boolean) => {
    setSelected((d) => ({ ...d, [id]: value }))
  }, [])
  const renderItem = useMemo(
    () => (s: Student) =>
      (
        <div
          key={s.id}
          className="collection-item flex justify-between items-center cursor-pointer"
          onClick={() => onClick(s.id, !selected[s.id])}
        >
          <Ellipsis className="color-secondary">{s.name}</Ellipsis>
          {selected[s.id] && (
            <div className="-my-3 -mr-5 flex color-secondary">
              <Icon center className="text-5xl">
                check_circle
              </Icon>
            </div>
          )}
          {!selected[s.id] && (
            <div className="-my-3 -mr-5 flex color-text-gray">
              <Icon center className="text-5xl">
                radio_button_unchecked
              </Icon>
            </div>
          )}
        </div>
      ),
    [onClick, selected]
  )

  useEffect(() => {
    setSelected((selected) => {
      const newSelected: Record<string, boolean> = {}
      students.forEach((s) => {
        newSelected[s.id] = selected[s.id] || false
      })

      return newSelected
    })
  }, [students])

  useEffect(() => {
    onChange(selected)
  }, [onChange, selected])

  useEffect(() => {
    if (initialSelected) {
      setSelected(initialSelected)
    }
  }, [initialSelected])

  return <>{students?.length ? <List items={students} renderItem={renderItem} /> : <NoStudents />}</>
}

// TODO: add implementation
const NoStudents = () => <div />
