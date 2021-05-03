import React from 'react'
import { Providers } from './Providers'
import { Routing } from './Routing'
import 'materialize-css'
import 'react-tiny-fab/dist/styles.css'
import './App.css'

// TODO: move routing to separate file
function App() {
  return (
    <Providers>
      <Routing />
    </Providers>
  )
}

export default App
