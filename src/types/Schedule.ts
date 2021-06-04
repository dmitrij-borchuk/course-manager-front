import { Group } from './group'

export type ScheduleBase = {
  start: string
  end: string
  cron: string
}

export type Schedule = ScheduleBase & {
  id: string
  group: string
}

export type ScheduleFull = Omit<Schedule, 'group'> & {
  group: Group
}

export type NewSchedule = Omit<Schedule, 'id'>

type ParsedDates = {
  start: Date
  end: Date
}
type WithParsedDates<T> = Omit<T, 'start' | 'end'> & ParsedDates

export type ScheduleParsedFull = WithParsedDates<ScheduleFull>
export type ScheduleParsed = WithParsedDates<Schedule>
export type ScheduleBaseParsed = WithParsedDates<ScheduleBase>
export type NewScheduleParsed = WithParsedDates<NewSchedule>
