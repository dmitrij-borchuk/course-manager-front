import constate from 'constate'
import { useAttendancesStore } from './attendancesStore'
import { useAuthStore } from './authStore'
import useGroupsStore from './groupsStore'
import useStudentsStore, { InitialStudentsState } from './studentsStore'
import useActivitiesStore, { InitialActivitiesState } from './activitiesStore'
import useOrganizationsStore from './organizationsStore'
import useUsersStore from './usersStore'
import useStudentsOfGroupStore from './studentsOfGroupStore'

import { createSlice, configureStore } from '@reduxjs/toolkit'
import { profileSlice } from './profile/slice'

// TODO: rid of `constate`
export type DefaultStore = {
  students?: InitialStudentsState
  activities?: InitialActivitiesState
}
function useStore({ students, activities }: DefaultStore) {
  return {
    groups: useGroupsStore(),
    auth: useAuthStore(),
    attendances: useAttendancesStore(),
    students: useStudentsStore(students),
    activities: useActivitiesStore(activities),
    studentsOfGroup: useStudentsOfGroupStore(),
    organizations: useOrganizationsStore(),
    users: useUsersStore(),
  }
}

const [StoreProvider, groups, auth, attendances, students, activities, studentsOfGroup, organizations, users] =
  constate(
    useStore,
    (value) => value.groups,
    (value) => value.auth,
    (value) => value.attendances,
    (value) => value.students,
    (value) => value.activities,
    (value) => value.studentsOfGroup,
    (value) => value.organizations,
    (value) => value.users
  )

export default StoreProvider

export const useGroupsState = groups
export const useAuthState = auth
export const useAttendancesState = attendances
export const useStudentsState = students
export const useActivitiesState = activities
export const useStudentsOfGroupState = studentsOfGroup
export const useOrganizationsState = organizations
export const useUsersState = users

// We are going to use Redux

export const rootStore = configureStore({
  reducer: profileSlice.reducer,
})

// store.subscribe(() => console.log(store.getState()))

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}
