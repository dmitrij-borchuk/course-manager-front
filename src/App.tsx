import React from 'react'
import { Providers } from './Providers'
import { Routing } from './Routing'
import 'materialize-css'

function App() {
  return (
    <Providers>
      <Routing />
    </Providers>
  )
}

export default App
