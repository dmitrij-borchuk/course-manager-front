import { useEffect } from 'react'
import 'materialize-css'
import { Providers } from './Providers'
import { Routing } from './Routing'
import { listenForAuthUserChange } from 'store/authSlice'
import { useAppDispatch } from 'store/hooks'
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
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(listenForAuthUserChange())
  }, [dispatch])

  return <Routing />
}
