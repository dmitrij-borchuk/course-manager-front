import { InviteInfo, Organization, OrganizationCreate } from '../types/organization'
import request from './request'

export function migrateOrganizations() {
  return request.post<string>('/organizations/migrate')
}

export function getUserOrganizations() {
  return request.get<Organization[]>('/organizations')
}

export function getInviteInfo(token: string) {
  return request.get<InviteInfo>(`/organizations/inviteInfo/${token}`)
}

export function createOrganizations(data: OrganizationCreate) {
  return request.post<Organization>('/organizations', data)
}
