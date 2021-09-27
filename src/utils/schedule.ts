import cronParser from 'cron-parser'
import { Group } from '../types/group'

export function getClassesDates(group: Group, to?: Date, from?: Date) {
  // const schedule = group.schedules[0]
  // if (!schedule) {
  //   return []
  // }

  // const interval = cronParser.parseExpression(schedule.cron, {
  //   currentDate: from ? from : new Date(schedule.start),
  //   endDate: to ? to : new Date(schedule.end),
  //   iterator: true,
  // })
  // const classes: Date[] = []
  // while (true) {
  //   try {
  //     const obj = interval.next()
  //     classes.push(obj.value.toDate())
  //   } catch (e) {
  //     break
  //   }

  //   if (classes.length > 366) {
  //     throw new Error(
  //       `More than 366 classes found, look like something is wrong with schedule format. Details: ${JSON.stringify(
  //         schedule
  //       )}`
  //     )
  //   }
  // }
  //
  // return classes
  return []
}
