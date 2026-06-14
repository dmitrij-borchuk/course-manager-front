import request from 'api/request'
import {
  OrganizationUnit,
  OrganizationUnitCreate,
  OrganizationUnitTree,
  OrganizationUnitUpdate,
  OrgUnitMembership,
} from 'types/organizationUnit'

const BASE = '/units'

export function getOrgUnitsRequest() {
  return request.get<OrganizationUnit[]>(BASE)
}

export function getOrgUnitTreeRequest() {
  return request.get<OrganizationUnitTree[]>(`${BASE}/tree`)
}

export function getOrgUnitRequest(id: string) {
  return request.get<OrganizationUnit>(`${BASE}/${id}`)
}

export function createOrgUnitRequest(data: OrganizationUnitCreate) {
  return request.post<OrganizationUnit>(BASE, data)
}

export function updateOrgUnitRequest(id: string, data: OrganizationUnitUpdate) {
  return request.put<OrganizationUnit>(`${BASE}/${id}`, data)
}

export function moveOrgUnitRequest(id: string, parentId: string | null) {
  return request.post<OrganizationUnit>(`${BASE}/${id}/move`, { parentId })
}

export function archiveOrgUnitRequest(id: string) {
  return request.post<{ success: boolean }>(`${BASE}/${id}/archive`, {})
}

export function getUnitMembershipsRequest(unitId: string) {
  return request.get<OrgUnitMembership[]>(`${BASE}/${unitId}/memberships`)
}

export function addUnitMembershipRequest(
  unitId: string,
  participantId: number,
  options?: { subjectType?: string; effectiveFrom?: string }
) {
  return request.post<{ id: string }>(`${BASE}/${unitId}/memberships`, {
    participantId,
    ...options,
  })
}

export function endMembershipRequest(membershipId: string, effectiveTo: string) {
  return request.post<{ success: boolean }>(`${BASE}/memberships/${membershipId}/end`, {
    effectiveTo,
  })
}

export function reassignMembershipRequest(membershipId: string, newUnitId: string) {
  return request.post<{ id: string }>(`${BASE}/memberships/${membershipId}/reassign`, {
    newUnitId,
  })
}
