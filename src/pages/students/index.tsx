import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const StudentsListPageLoadable = loadable<{}>(() => import('./StudentList'), {
  fallback: <Loader />,
})

export const StudentPageLoadable = loadable<{}>(() => import('./Student'), {
  fallback: <Loader />,
})
