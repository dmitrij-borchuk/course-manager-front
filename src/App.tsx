import { useCallback, useEffect, useState } from 'react'
import 'materialize-css'
import CssBaseline from '@mui/material/CssBaseline'
import { Providers } from './Providers'
import { Routing } from './Routing'
import { listenForAuthUserChange, unsubscribeFromAuthUserChange } from 'store/authSlice'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { initiateApp } from 'store/applicationStore'
import { useUsersState } from './store'
import { updateConfiguration } from './utils/rollbar'
import { Loader } from './components/kit/loader/Loader'

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
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.application.auth.data)
  const { fetchProfile } = useUsersState()
  const [initiated, setInitiated] = useState(false)

  useEffect(() => {
    dispatch(listenForAuthUserChange())
    return () => {
      dispatch(unsubscribeFromAuthUserChange())
    }
  }, [dispatch])
  useEffect(() => {
    if (authUser) {
      fetchProfile()
    }
  }, [fetchProfile, authUser])
  const initiate = useCallback(async () => {
    await dispatch(initiateApp())
    setInitiated(true)
  }, [dispatch])

  useEffect(() => {
    initiate()
  }, [initiate])

  if (!initiated) {
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
