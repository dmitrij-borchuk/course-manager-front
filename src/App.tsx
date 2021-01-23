import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'materialize-css'
import { Providers } from './Providers'
import { Dashboard } from './components/dashboard/Dashboard'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import './App.css'

function App() {
  return (
    <Providers>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <AuthGuardedRoute component={Dashboard} path="/" />
        </Switch>
      </Router>
    </Providers>
  )
}

export default App
