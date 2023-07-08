import request from 'api/request'
import { Profile } from 'types/profile'

export function getProfilesRequest(deleted = false) {
  const query = typeof deleted === 'boolean' ? `?deleted=${deleted}` : ''
  return request.get<Profile[]>(`/profiles${query}`)
}

export function getProfileRequest(id: number) {
  return request.get<Profile>(`/profiles/${id}`)
}

export function updateProfileRequest(id: number, name: string) {
  return request.put<Profile>(`/profiles/${id}`, {
    name,
  })
}
