import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const AdminPageLoadable = loadable<{}>(() => import('./DataMigration'), {
  fallback: <Loader />,
})

export const AdminBackupPageLoadable = loadable<{}>(() => import('./Backup'), {
  fallback: <Loader />,
})
