import { createScheduleRequest, editScheduleRequest } from '../api/schedule'
import { NewScheduleParsed, ScheduleParsed } from '../types/Schedule'

export function createSchedule(data: NewScheduleParsed) {
  if (data.start > data.end) {
    // TODO: intl
    throw new Error('schedule.form.error.startDate')
  }

  return createScheduleRequest({
    ...data,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
  })
}

export function editSchedule(data: ScheduleParsed) {
  if (data.start > data.end) {
    // TODO: intl
    throw new Error('schedule.form.error.startDate')
  }

  return editScheduleRequest({
    ...data,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
  })
}
