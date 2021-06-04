import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const SchedulePageLoadable = loadable<{}>(() => import('./Schedule'), {
  fallback: <Loader />,
})
