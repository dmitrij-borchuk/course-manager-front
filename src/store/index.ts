import constate from 'constate'
import { useAttendancesStore } from './attendancesStore'
import { useAuthStore } from './authStore'
import useGroupsStore from './groupsStore'
import useStudentsStore from './studentsStore'
import useTeachersStore from './teachersStore'
import useOrganizationsStore from './organizationsStore'

function useStore() {
  return {
    teachers: useTeachersStore(),
    groups: useGroupsStore(),
    auth: useAuthStore(),
    attendances: useAttendancesStore(),
    students: useStudentsStore(),
    organizations: useOrganizationsStore(),
  }
}

const [StoreProvider, teachers, groups, auth, attendances, students, organizations] = constate(
  useStore,
  (value) => value.teachers,
  (value) => value.groups,
  (value) => value.auth,
  (value) => value.attendances,
  (value) => value.students,
  (value) => value.organizations
)

export default StoreProvider

export const useTeachersState = teachers
export const useGroupsState = groups
export const useAuthState = auth
export const useAttendancesState = attendances
export const useStudentsState = students
export const useOrganizationsState = organizations
