import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const ReportsPageLoadable = loadable<{}>(() => import('./Reports'), {
  fallback: <Loader />,
})
