import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const GroupsListPageLoadable = loadable<{}>(() => import('./GroupsList'), {
  fallback: <Loader />,
})

export const CreateGroupPageLoadable = loadable<{}>(() => import('./CreateGroup'), {
  fallback: <Loader />,
})

export const EditGroupPageLoadable = loadable<{}>(() => import('./EditGroup'), {
  fallback: <Loader />,
})

export const GroupPageLoadable = loadable<{}>(() => import('./Group'), {
  fallback: <Loader />,
})
