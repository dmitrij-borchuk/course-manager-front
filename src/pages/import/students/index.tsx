import loadable from '@loadable/component'
import { Loader } from '../../../components/kit/loader/Loader'

export const StudentImportPageLoadable = loadable<{}>(() => import('./Students'), {
  fallback: <Loader />,
})
