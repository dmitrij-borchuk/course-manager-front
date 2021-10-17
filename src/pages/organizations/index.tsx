import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const CreateOrganizationPageLoadable = loadable<{}>(() => import('./CreateOrganization'), {
  fallback: <Loader />,
})
