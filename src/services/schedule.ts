import { createScheduleRequest, editScheduleRequest } from '../api/schedule'
import { NewScheduleParsed, ScheduleParsed } from '../types/Schedule'

export function createSchedule(data: NewScheduleParsed) {
  if (data.start > data.end) {
    // TODO: intl
    throw new Error('Start date is bigger than end date')
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
    throw new Error('Start date is bigger than end date')
  }

  return editScheduleRequest({
    ...data,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
  })
}
