import request from 'api/request'

export function getReportByTagRequest(from: Date, to: Date, tags: string[], order: 'asc' | 'desc', orderBy: string) {
  const tagsParams = tags.map((tag) => `tags=${tag}`).join('&')
  return request.get<ReportServerRecord[]>(
    `/report?from=${from.toUTCString()}&to=${to.toUTCString()}&${tagsParams}&order=${order}&orderBy=${orderBy}`
  )
}
export function getReportPreviewRequest(
  filters: ReportFilter[],
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  orderBy: string,
  from: Date,
  to: Date
) {
  return request.post<{
    data: ReportPreviewRecord[]
    total: number
  }>(`/report/preview`, {
    filters,
    page,
    pageSize,
    order,
    orderBy,
    from,
    to,
  })
}
export function getReportByFilterRequest(
  filters: ReportFilter[],
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  orderBy: string,
  from: Date,
  to: Date
) {
  return request.post<ReportByFilterServerRecord[]>(`/report/byFilter`, {
    filters,
    page,
    pageSize,
    order,
    orderBy,
    from,
    to,
  })
}

export type ReportFilter = {
  field: string
  value: string | string[] | number | number[]
  operation: string
}

type ReportServerRecord = {
  activityId: number
  activityName: string
  activityOuterId: string
  participantId: number
  participantName: string
  rate: number
  attended: number
  total: number
}
export type ReportByFilterServerRecord = ReportPreviewRecord & {
  rate: number
  attended: number
  total: number
}
type ReportPreviewRecord = {
  id: number
  name: string
  tags: string[]
  outerId: string
  startDate: string
  endDate: string
  activityId: number
  activityOuterId: string
  activityName: string
  activityDeleted: boolean
  activityArchived: boolean
  performerId: number
  performerName: string
}
