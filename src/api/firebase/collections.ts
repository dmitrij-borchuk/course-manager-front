import { Identified } from '../../types/identified'
import { Organization } from '../../types/organization'
import { UserMetadata } from '../../types/user'
import { collection } from './firestore'

export const organizations = collection<Organization>('organizations')

export const users = collection<UserMetadata>('users')

export function makeOrgCollection<T extends Identified>(name: string, orgId: string) {
  return collection<T>(`organizations/${orgId}/${name}`)
}
