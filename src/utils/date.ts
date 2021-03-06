export function datesInRange(start: Date, end: Date, steps = 1) {
  const dateArray: Date[] = []
  let currentDate = new Date(start)

  while (currentDate <= end) {
    dateArray.push(new Date(currentDate))
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps)
  }

  return dateArray
}
