import { Role } from '../types/role'
import request from './request'

export function getRolesRequest() {
  return request.get<{ roles: Role[] }>('/users-permissions/roles')
}
