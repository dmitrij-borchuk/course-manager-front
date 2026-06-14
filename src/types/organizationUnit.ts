export type OrganizationUnit = {
  id: string
  organizationId: number
  name: string
  parentId: string | null
  sortOrder: number
  archivedAt: string | null
}

export type OrganizationUnitTree = OrganizationUnit & {
  children: OrganizationUnitTree[]
}

export type OrganizationUnitCreate = {
  name: string
  parentId?: string | null
  sortOrder?: number
}

export type OrganizationUnitUpdate = {
  name?: string
  sortOrder?: number
}

export type OrgUnitMembership = {
  id: string
  unitId: string
  participantId: number
  subjectType: string
  effectiveFrom: string | null
  effectiveTo: string | null
}
