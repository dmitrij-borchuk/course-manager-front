import constate from 'constate'
import { ReactNode } from 'react'
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { calcCurrentOrganization } from 'modules/organizations/store/currentOrg'
import { organizationsReducer } from 'modules/organizations/store'
import { fetchCurrentProfile } from 'modules/profiles/store/currentProfile'
import { profilesReducer } from 'modules/profiles/store'
import { useAttendancesStore } from './attendancesStore'
import { useAuthStore } from './authStore'
import useGroupsStore from './groupsStore'
import useStudentsStore, { InitialStudentsState } from './studentsStore'
import useActivitiesStore, { InitialActivitiesState } from './activitiesStore'
import useOrganizationsStore from './organizationsStore'
import useUsersStore from './usersStore'
import useStudentsOfGroupStore from './studentsOfGroupStore'

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

const [ConstateStoreProvider, groups, auth, attendances, students, activities, studentsOfGroup, organizations, users] =
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

export default ConstateStoreProvider

export const useGroupsState = groups
export const useAuthState = auth
export const useAttendancesState = attendances
export const useStudentsState = students
export const useActivitiesState = activities
export const useStudentsOfGroupState = studentsOfGroup
export const useOrganizationsState = organizations
export const useUsersState = users

export function makeStore(initialState?: Record<any, any>) {
  return configureStore({
    reducer: {
      organizations: organizationsReducer,
      profiles: profilesReducer,
    },
    preloadedState: initialState,
  })
}
const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const StoreProvider = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>

export const initApplicationState = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'app/init',
  async (_, { dispatch }) => {
    await dispatch(calcCurrentOrganization())
    await dispatch(fetchCurrentProfile())
  }
)
