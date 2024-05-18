import { Suspense, lazy } from 'react'
// import loadable from '@loadable/component'
import { Loader } from '../../components/kit/loader/Loader'
import Reports from './Reports'

export const ReportsPage = Reports
// export const ReportsPage = lazy(() => import('./Reports'))
// export const ReportsPageLoadable = loadable<{}>(() => import('./Reports'), {
//   fallback: <Loader />,
// })

export function ReportsPageLoadable() {
  return (
    // <Suspense fallback={<Loader />}>
    <ReportsPage />
    // </Suspense>
  )
}
