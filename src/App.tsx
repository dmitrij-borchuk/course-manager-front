import React from 'react'
import { Providers } from './Providers'
import { Routing } from './Routing'
import 'materialize-css'
import { useAuthState } from './store'
import { Loader } from './components/kit/loader/Loader'

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

  if (initiatingAuth) {
    return (
      <div>
        {/* TODO: add splash screen */}
        <Loader show />
      </div>
    )
  }

  return <Routing />
}
