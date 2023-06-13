import { Profile } from 'types/profile'
import request from './request'

export function getProfilesRequest() {
  return request.get<Profile[]>(`/profiles`)
}
