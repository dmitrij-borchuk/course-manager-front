import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'materialize-css'
import { Providers } from './Providers'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import './App.css'
import { DashboardPage } from './pages/dashboard/Dashboard'

function App() {
  return (
    <Providers>
      <Router>
        <Switch>
          <AuthGuardedRoute component={DashboardPage} path="/" exact />
          <Route path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </Providers>
  )
}

export default App
