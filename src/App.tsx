import CssBaseline from '@mui/material/CssBaseline'
import { Providers } from './Providers'
import { Routing } from './Routing'
import 'materialize-css'
import { initApplicationState, useAuthState, useUsersState } from './store'
import { Loader } from './components/kit/loader/Loader'
import { updateConfiguration } from './utils/rollbar'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEffect } from 'react'

updateConfiguration()

function App() {
  return (
    <Providers>
      <Initiator />
    </Providers>
  )
}

export default App

function Initiator() {
  const { initiatingAuth, currentUser } = useAuthState()
  const dispatch = useAppDispatch()
  const loadingCurrentOrg = useAppSelector((state) => state.organizations.currentOrg.loading)
  const { fetchProfile } = useUsersState()

  useEffect(() => {
    if (currentUser) {
      fetchProfile()
    }
  }, [fetchProfile, currentUser])
  useEffect(() => {
    if (currentUser) {
      dispatch(initApplicationState())
    }
  }, [currentUser, dispatch])

  if (initiatingAuth || loadingCurrentOrg) {
    return (
      <div>
        <CssBaseline enableColorScheme />
        {/* TODO: add splash screen */}
        <Loader show data-testid="app-preloader" />
      </div>
    )
  }

  return <Routing />
}
