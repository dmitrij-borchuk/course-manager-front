import { Organization } from '../../types/organization'
import { UserMetadata } from '../../types/user'
import { collection } from './firestore'

export const organizations = collection<Organization>('organizations')

export const users = collection<UserMetadata>('users')
