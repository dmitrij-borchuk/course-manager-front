export type ActivityBase = {
  // name: string
  // tags: string[]
  // outerId: string
}

export type Activity = ActivityBase & {
  id: number
  type: 'group'
  name: string
  performerId: number | null
  organization: number
  // Used by the attendances for the backwards compatibility (groups were migrated from firebase)
  outerId: string

  updatedBy: number
  createdAt: string
  updatedAt: string
}
