import constate from 'constate'
import useGroupsStore from './groupsStore'
import useTeachersStore from './teachersStore'

function useStore() {
  return {
    teachers: useTeachersStore(),
    groups: useGroupsStore(),
  }
}

const [StoreProvider, teachers, groups] = constate(
  useStore,
  (value) => value.teachers,
  (value) => value.groups
)

export default StoreProvider

export const useTeachersState = teachers
export const useGroupsState = groups
