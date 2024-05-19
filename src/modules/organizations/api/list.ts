import request from 'api/request'
import { Organization } from 'types/organization'

export function getUserOrganizations() {
  return request.get<Organization[]>('/organizations')
}
