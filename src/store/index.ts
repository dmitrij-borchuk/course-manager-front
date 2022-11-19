import constate from 'constate'
import { useAttendancesStore } from './attendancesStore'
import { useAuthStore } from './authStore'
import useGroupsStore from './groupsStore'
import useStudentsStore, { InitialStudentsState } from './studentsStore'
import useTeachersStore from './teachersStore'
import useOrganizationsStore from './organizationsStore'
import useUsersStore from './usersStore'
import useStudentsOfGroupStore from './studentsOfGroupStore'

export type DefaultStore = {
  students?: InitialStudentsState
}
function useStore({ students }: DefaultStore) {
  return {
    teachers: useTeachersStore(),
    groups: useGroupsStore(),
    auth: useAuthStore(),
    attendances: useAttendancesStore(),
    students: useStudentsStore(students),
    studentsOfGroup: useStudentsOfGroupStore(),
    organizations: useOrganizationsStore(),
    users: useUsersStore(),
  }
}

const [StoreProvider, teachers, groups, auth, attendances, students, studentsOfGroup, organizations, users] = constate(
  useStore,
  (value) => value.teachers,
  (value) => value.groups,
  (value) => value.auth,
  (value) => value.attendances,
  (value) => value.students,
  (value) => value.studentsOfGroup,
  (value) => value.organizations,
  (value) => value.users
)

export default StoreProvider

export const useTeachersState = teachers
export const useGroupsState = groups
export const useAuthState = auth
export const useAttendancesState = attendances
export const useStudentsState = students
export const useStudentsOfGroupState = studentsOfGroup
export const useOrganizationsState = organizations
export const useUsersState = users
