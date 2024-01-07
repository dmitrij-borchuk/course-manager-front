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
  orderBy: string
) {
  return request.post<ReportPreviewRecord[]>(`/report/preview`, {
    filters,
    page,
    pageSize,
    order,
    orderBy,
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
type ReportPreviewRecord = {
  id: number
  name: string
  tags: string[]
  outerId: string
}
