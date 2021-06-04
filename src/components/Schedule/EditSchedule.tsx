import React, { useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'react-materialize'
import { useFormWithError } from '../../hooks/useFormWithError'
import { Schedule } from '../../types/Schedule'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '../kit/formLayout/FormLayout'
import { Message } from '../kit/message/Message'
import { WeekdaySelector } from '../kit/weekdaySelector/WeekdaySelector'

export type ScheduleFormData = {
  start: Date
  end: Date
  cron: string
}
interface Props {
  className?: string
  loading?: boolean
  submitting?: boolean
  onSubmit: (data: ScheduleFormData) => void
  initial?: Schedule
}
export const EditSchedule: React.FC<Props> = ({
  className,
  loading = false,
  submitting = false,
  initial,
  onSubmit,
}) => {
  const intl = useIntl()
  const { control, handleSubmit, errors, setError } = useFormWithError<ScheduleFormData>({
    defaultValues: {
      cron: '* * * * *',
      ...initial,
      start: initial?.start ? new Date(initial.start) : '',
      end: initial?.end ? new Date(initial.end) : '',
    },
    reValidateMode: 'onChange',
  })
  const onLocalSubmit = useCallback(
    async (d) => {
      try {
        await onSubmit(d)
      } catch (error) {
        setError('start', {
          message: error.message,
          shouldFocus: true,
        })
      }
    },
    [onSubmit, setError]
  )

  // TODO: validation of `start` and `end`
  // TODO: set date selector for the `start` and `end`

  return (
    <div className={`container px-4 ${className}`}>
      <FormLayout
        header={<FormattedMessage id="schedule.form.title" />}
        controls={<SubmitButton loading={submitting} disabled={loading} />}
        onSubmit={handleSubmit(onLocalSubmit)}
      >
        {/* Start date */}
        <Controller
          id="start"
          control={control}
          name="start"
          label={`${intl.formatMessage({ id: 'schedule.form.start' })} *`}
          rules={{
            required: {
              value: true,
              message: 'Required',
            },
          }}
          render={({ value, ...renderProps }) => {
            return (
              <DatePicker
                id="start"
                options={{
                  autoClose: true,
                  format: 'mmm dd, yyyy',
                  defaultDate: value,
                  setDefaultDate: true,
                }}
                // @ts-ignore
                label={`${intl.formatMessage({ id: 'schedule.form.start' })} *`}
                disabled={loading || submitting}
                {...renderProps}
              />
            )
          }}
        />
        <div className="-mt-6">
          <Message type="error">{errors['start']?.message || <span>&nbsp;</span>}</Message>
        </div>

        <Controller
          id="end"
          control={control}
          name="end"
          label={`${intl.formatMessage({ id: 'schedule.form.end' })} *`}
          rules={{
            required: {
              value: true,
              message: 'Required',
            },
          }}
          render={({ value, ...renderProps }) => (
            <DatePicker
              id="end"
              options={{
                autoClose: true,
                format: 'mmm dd, yyyy',
                defaultDate: value,
                setDefaultDate: true,
              }}
              // @ts-ignore
              label={`${intl.formatMessage({ id: 'schedule.form.end' })} *`}
              disabled={loading || submitting}
              {...renderProps}
            />
          )}
        />
        <div className="-mt-6">
          <Message type="error">{errors['end']?.message || <span>&nbsp;</span>}</Message>
        </div>

        <div className="pt-4">
          {/* Weekday */}
          <Controller
            control={control}
            name="cron"
            rules={{
              pattern: {
                message: intl.formatMessage({ id: 'schedule.form.crud.required' }),
                value: /\* \* \* \* \d/,
              },
            }}
            render={(renderProps) => <WeekdaySelector {...renderProps} />}
          />
          <div className="mt-3">
            <Message type="error">{errors['cron']?.message || <span>&nbsp;</span>}</Message>
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
