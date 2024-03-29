import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const StudentsListPageLoadable = loadable<{}>(() => import('./StudentList'), {
  fallback: <Loader />,
})

export const StudentPageLoadable = loadable<{}>(() => import('./Student'), {
  fallback: <Loader />,
})

export const CreateStudentPageLoadable = loadable<{}>(() => import('./CreateStudent'), {
  fallback: <Loader />,
})

export const EditStudentPageLoadable = loadable<{}>(() => import('./EditStudent'), {
  fallback: <Loader />,
})

export const StudentInGroupPageLoadable = loadable<{}>(() => import('./StudentInGroup'), {
  fallback: <Loader />,
})
