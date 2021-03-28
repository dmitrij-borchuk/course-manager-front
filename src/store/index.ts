import constate from 'constate'
import { useAuthStore } from './authStore'
import useGroupsStore from './groupsStore'
import useTeachersStore from './teachersStore'

function useStore() {
  return {
    teachers: useTeachersStore(),
    groups: useGroupsStore(),
    auth: useAuthStore(),
  }
}

const [StoreProvider, teachers, groups, auth] = constate(
  useStore,
  (value) => value.teachers,
  (value) => value.groups,
  (value) => value.auth
)

export default StoreProvider

export const useTeachersState = teachers
export const useGroupsState = groups
export const useAuthState = auth
