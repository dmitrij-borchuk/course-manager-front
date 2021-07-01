import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const AttendanceEditorLoadable = loadable<{}>(() => import('./AttendanceEditor'), {
  fallback: <Loader />,
})
