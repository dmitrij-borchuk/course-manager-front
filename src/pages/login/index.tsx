import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'

export const LoginPageLoadable = loadable<{}>(() => import('./LoginPage'), {
  fallback: <Loader />,
})
