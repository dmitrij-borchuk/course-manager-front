import React, { useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'react-materialize'
import { useFormWithError } from '../../hooks/useFormWithError'
import { Schedule } from '../../types/Schedule'
import { SubmitButton } from '../kit/buttons/SubmitButton'
import { FormLayout } from '@/templates/FormLayout'
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useFormWithError<ScheduleFormData>({
    defaultValues: {
      cron: '0 12 * * *',
      ...initial,
      // @ts-expect-error TODO: fix this
      start: initial?.start ? new Date(initial.start) : '',
      // @ts-expect-error TODO: fix this
      end: initial?.end ? new Date(initial.end) : '',
    },
    reValidateMode: 'onChange',
  })
  const onLocalSubmit = useCallback(
    async (d: ScheduleFormData) => {
      try {
        await onSubmit(d)
      } catch (error) {
        if (error instanceof Error) {
          setError('start', {
            message: error.message,
            // @ts-expect-error TODO: fix this
            shouldFocus: true,
          })
          return
        }
        throw error
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
        // @ts-expect-error todo: fix this
        onSubmit={handleSubmit(onLocalSubmit)}
      >
        {/* Start date */}
        <Controller
          control={control}
          name="start"
          rules={{
            required: {
              value: true,
              message: 'Required',
            },
          }}
          render={({ field }) => (
            <DatePicker
              id="start"
              options={{
                autoClose: true,
                format: 'mmm dd, yyyy',
                defaultDate: field.value,
                setDefaultDate: true,
              }}
              // @ts-expect-error TODO: fix this
              label={`${intl.formatMessage({ id: 'schedule.form.start' })} *`}
              disabled={loading || submitting}
              {...field}
            />
          )}
        />
        <div className="-mt-6">
          <Message type="error">{errors['start']?.message || <span>&nbsp;</span>}</Message>
        </div>

        <Controller
          control={control}
          name="end"
          rules={{
            required: {
              value: true,
              message: 'Required',
            },
          }}
          render={({ field }) => (
            <DatePicker
              id="end"
              options={{
                autoClose: true,
                format: 'mmm dd, yyyy',
                defaultDate: field.value,
                setDefaultDate: true,
              }}
              // @ts-expect-error TODO: fix this
              label={`${intl.formatMessage({ id: 'schedule.form.end' })} *`}
              disabled={loading || submitting}
              {...field}
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
                message: intl.formatMessage({ id: 'schedule.form.cron.required' }),
                value: /0 12 \* \* \d/,
              },
            }}
            render={({ field }) => <WeekdaySelector {...field} />}
          />
          <div className="mt-3">
            <Message type="error">{errors['cron']?.message || <span>&nbsp;</span>}</Message>
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
