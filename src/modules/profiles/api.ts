import request from 'api/request'
import { Profile } from 'types/profile'

export function getProfilesRequest() {
  return request.get<Profile[]>(`/profiles`)
}

export function getProfileRequest(id: number) {
  return request.get<Profile>(`/profiles/${id}`)
}

export function updateProfileRequest(id: number, name: string) {
  return request.put<Profile>(`/profiles/${id}`, {
    name,
  })
}
