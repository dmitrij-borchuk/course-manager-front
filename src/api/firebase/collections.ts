import { OrganizationFirebase } from '../../types/organization'
import { UserMetadata } from '../../types/user'
import { collection } from './firestore'

export const organizations = collection<OrganizationFirebase>('organizations')

export const users = collection<UserMetadata>('users')

export function makeOrgCollection<T extends { id: string }>(name: string, orgId: string) {
  return collection<T>(`organizations/${orgId}/${name}`)
}
