import React, { useEffect } from 'react'
import { Providers } from './Providers'
import { Routing } from './Routing'
import 'materialize-css'
import { useAuthState, useOrganizationsState } from './store'
import { Loader } from './components/kit/loader/Loader'
import { updateConfiguration } from './utils/rollbar'

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
  const { initiatingAuth } = useAuthState()
  const { fetchAll, loading, byId } = useOrganizationsState()

  useEffect(() => {
    if (!initiatingAuth && !loading && !byId) {
      fetchAll()
    }
  }, [byId, fetchAll, initiatingAuth, loading])

  if (initiatingAuth || !byId) {
    return (
      <div>
        {/* TODO: add splash screen */}
        <Loader show data-testid="app-preloader" />
      </div>
    )
  }

  return <Routing />
}
