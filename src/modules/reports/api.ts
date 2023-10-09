import request from 'api/request'

export function getReportByTagRequest(from: Date, to: Date, tags: string[], order: 'asc' | 'desc', orderBy: string) {
  const tagsParams = tags.map((tag) => `tags=${tag}`).join('&')
  return request.get<ReportServerRecord[]>(
    `/report?from=${from.toUTCString()}&to=${to.toUTCString()}&${tagsParams}&order=${order}&orderBy=${orderBy}`
  )
}

export function getReportByPromptRequest(text: string) {
  return request.post<any>(`/report/auto`, { message: text })
}

type ReportServerRecord = {
  activityId: number
  activityName: string
  activityOuterId: string
  participantId: number
  participantName: string
  rate: number
}
