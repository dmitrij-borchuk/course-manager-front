import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

interface Props {}
export const GroupsListPageLoadable = loadable<Props>(() => import('./GroupsList'), {
  fallback: <Loader />,
})
