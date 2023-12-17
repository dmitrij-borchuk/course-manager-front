export function sortAttendanceReport<T extends ReportItem>(order: 'asc' | 'desc', list: T[]) {
  return list.sort((a, b) => {
    if (a.rate === undefined) {
      return 1
    }
    if (b.rate === undefined) {
      return -1
    }

    return order === 'asc' ? a.rate - b.rate : b.rate - a.rate
  })
}
type ReportItem = {
  rate?: number
}

export function hasRate(item: ReportItem): item is ReportItem & { value: number } {
  return typeof item.rate === 'number'
}
