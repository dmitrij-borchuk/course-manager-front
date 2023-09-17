export function sortAttendanceReport<T extends ReportItem>(order: 'asc' | 'desc', list: T[]) {
  return list.sort((a, b) => {
    if (a.value === undefined) {
      return 1
    }
    if (b.value === undefined) {
      return -1
    }

    return order === 'asc' ? a.value - b.value : b.value - a.value
  })
}
type ReportItem = {
  value?: number
}

export function hasRate(item: ReportItem): item is ReportItem & { value: number } {
  return typeof item.value === 'number'
}
